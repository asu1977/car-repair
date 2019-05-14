import React from 'react';
import { Link } from 'react-router-dom';

import { Query, Mutation } from 'react-apollo';
import {
  GET_USER_CARS,
  DELETE_USER_CAR,
  GET_ALL_CARS,
  GET_CURRENT_USER,
  UPDATE_USER_CAR
} from '../../queries';
import Spinner from '../Spinner';

class UserCars extends React.Component {
  state = {
    _id: '',
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    modal: false
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleDelete = deleteUserCar => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this car?'
    );
    if (confirmDelete) {
      deleteUserCar().then(({ data }) => {
        // console.log(data);
      });
    }
  };

  handleSubmit = (event, updateUserCar) => {
    event.preventDefault();
    updateUserCar().then(({ data }) => {
      console.log(data);
      this.closeModal();
    });
  };

  loadCar = car => {
    this.setState({ ...car, modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { username } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_CARS} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          // console.log(data);
          return (
            <ul>
              {modal && (
                <EditCarModal
                  handleSubmit={this.handleSubmit}
                  car={this.state}
                  closeModal={this.closeModal}
                  handleChange={this.handleChange}
                />
              )}
              <h3>Your Cars</h3>
              {!data.getUserCars.length && (
                <p>
                  <strong>You have not added any cars yet</strong>
                </p>
              )}
              {data.getUserCars.map(car => (
                <li key={car._id}>
                  <Link to={`/cars/${car._id}`}>
                    <p>{car.name}</p>
                  </Link>
                  <p style={{ marginBottom: '0' }}>Likes: {car.likes}</p>
                  <Mutation
                    mutation={DELETE_USER_CAR}
                    variables={{ _id: car._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_CARS },
                      { query: GET_CURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserCar } }) => {
                      const { getUserCars } = cache.readQuery({
                        query: GET_USER_CARS,
                        variables: { username }
                      });

                      cache.writeQuery({
                        query: GET_USER_CARS,
                        variables: { username },
                        data: {
                          getUserCars: getUserCars.filter(
                            car => car._id !== deleteUserCar._id
                          )
                        }
                      });
                    }}
                  >
                    {(deleteUserCar, attrs = {}) => (
                      <div>
                        <button
                          className="button-primary"
                          onClick={() => this.loadCar(car)}
                        >
                          Update
                        </button>
                        <p
                          className="delete-button"
                          onClick={() => this.handleDelete(deleteUserCar)}
                        >
                          {attrs.loading ? 'deleting...' : 'X'}
                        </p>
                      </div>
                    )}
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    );
  }
}

const EditCarModal = ({
  handleSubmit,
  car,
  handleChange,
  closeModal
}) => (
  <Mutation
    mutation={UPDATE_USER_CAR}
    variables={{
      _id: car._id,
      name: car.name,
      imageUrl: car.imageUrl,
      category: car.category,
      description: car.description
    }}
  >
    {updateUserCar => (
      <div className="modal modal-open">
        <div className="modal-inner">
          <div className="modal-content">
            <form
              onSubmit={event => handleSubmit(event, updateUserCar)}
              className="modal-content-inner"
            >
              <h4>Edit Car</h4>

              <label htmlFor="name">Car Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={car.name}
              />
              <label htmlFor="imageUrl">Car Image</label>
              <input
                type="text"
                name="imageUrl"
                onChange={handleChange}
                value={car.imageUrl}
              />
              <label htmlFor="category">Category of Car</label>
              <select
                name="category"
                onChange={handleChange}
                value={car.category}
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
                onChange={handleChange}
                value={car.description}
              />

              <hr />
              <div className="modal-buttons">
                <button type="submit" className="button-primary">
                  Update
                </button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </Mutation>
);

export default UserCars;
