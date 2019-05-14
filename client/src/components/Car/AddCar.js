import React from 'react';
import { withRouter } from 'react-router-dom';
import  CKEditor  from 'react-ckeditor-component';

import { Mutation } from 'react-apollo';
import { ADD_CAR, GET_ALL_CARS, GET_USER_CARS } from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';

const initialState = {
  name: '',
  imageUrl: '',
  instructions: '',
  category: 'B',
  description: '',
  username: ''
};

class AddCar extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleEditorChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };

  handleSubmit = (event, addCar) => {
    event.preventDefault();
    addCar().then(({ data }) => {
      // console.log(data);
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const { name, imageUrl, category, description, instructions } = this.state;
    const isInvalid = !name || !imageUrl || !category || !description || !instructions;
    return isInvalid;
  };

  updateCache = (cache, { data: { addCar } }) => {
    const { getAllCars } = cache.readQuery({ query: GET_ALL_CARS });

    cache.writeQuery({
      query: GET_ALL_CARS,
      data: {
        getAllCars: [addCar, ...getAllCars]
        // getAllCars: getAllCars.concat([addCar])

      }
    });
  };

  render() {
    const { name, imageUrl, category, description, instructions, username } = this.state;

    return (
      <Mutation
        mutation={ADD_CAR}
        variables={{ name, imageUrl, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_CARS, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addCar, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Car</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addCar)}
              >
                <label htmlFor="name">Car Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Add Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <label htmlFor="imageUrl">Car Image</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Add Image URL"
                  onChange={this.handleChange}
                  value={imageUrl}
                />
                <label htmlFor="category">Category of Car</label>
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                <label htmlFor="description">Car Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Add Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor="instructions">Car Instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                />
                {/* <textarea
                  name="instructions"
                  placeholder="Add instructions"
                  onChange={this.handleChange}
                  value={instructions}
                /> */}
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddCar));
