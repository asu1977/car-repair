import React from 'react';

import { Mutation } from 'react-apollo';
import { LIKE_CAR, UNLIKE_CAR, GET_CAR } from '../../queries';
import withSession from '../withSession';

class LikeCar extends React.Component {
  state = {
    liked: false,
    username: ''
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      const { _id } = this.props;
      const prevLiked =
        favorites.findIndex(favorite => favorite._id === _id) > -1;
      this.setState({
        liked: prevLiked,
        username
      });
    }
  }

  handleClick = (likeCar, unlikeCar) => {
    this.setState(
      prevState => ({
        liked: !prevState.liked
      }),
      () => this.handleLike(likeCar, unlikeCar)
    );
  };

  handleLike = (likeCar, unlikeCar) => {
    if (this.state.liked) {
      likeCar().then(async ({ data }) => {
        // console.log(data);
        await this.props.refetch();
      });
    } else {
      unlikeCar().then(async ({ data }) => {
        // console.log(data);
        await this.props.refetch();
      });
    }
  };

  updateLike = (cache, { data: { likeCar } }) => {
    const { _id } = this.props;
    const { getCar } = cache.readQuery({
      query: GET_CAR,
      variables: { _id }
    });

    cache.writeQuery({
      query: GET_CAR,
      variables: { _id },
      data: {
        getCar: { ...getCar, likes: likeCar.likes + 1 }
      }
    });
  };

  updateUnlike = (cache, { data: { unlikeCar } }) => {
    const { _id } = this.props;
    const { getCar } = cache.readQuery({
      query: GET_CAR,
      variables: { _id }
    });

    cache.writeQuery({
      query: GET_CAR,
      variables: { _id },
      data: {
        getCar: { ...getCar, likes: unlikeCar.likes - 1 }
      }
    });
  };

  render() {
    const { liked, username } = this.state;
    const { _id } = this.props;
    return (
      <Mutation
        mutation={UNLIKE_CAR}
        variables={{ _id, username }}
        update={this.updateUnlike}
      >
        {unlikeCar => (
          <Mutation
            mutation={LIKE_CAR}
            variables={{ _id, username }}
            update={this.updateLike}
          >
            {likeCar =>
              username && (
                <button
                  className="like-button"
                  onClick={() => this.handleClick(likeCar, unlikeCar)}
                >
                  {liked ? 'Unlike' : 'Like'}
                </button>
              )
            }
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default withSession(LikeCar);
