import React from 'react';
import { withRouter } from 'react-router-dom';

import { Query } from 'react-apollo';
import { GET_CAR } from '../../queries';
import LikeCar from './LikeCar';
import Spinner from '../Spinner';

const CarPage = ({ match }) => {
  const { _id } = match.params;
  return (
    <Query query={GET_CAR} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        // console.log(data);
        return (
          <div className="App">
            <div
              style={{
                background: `url(${
                  data.getCar.imageUrl
                }) center center / cover no-repeat`
              }}
              className="car-image"
            />
            <div className="car">
              <div className="car-header">
                <h2 className="car-name">
                  <strong>{data.getCar.name}</strong>
                </h2>
                <h5>
                  <strong>{data.getCar.category}</strong>
                </h5>
                <p>
                  Create by <strong>{data.getCar.username}</strong>
                </p>
                <p>
                  {data.getCar.likes}
                  <span role="img" aria-label="star">
                    ★
                  </span>
                </p>
              </div>
              <blockquote className="car-description">
                {data.getCar.description}
              </blockquote>
              <h3 className="car-instructions__title">Instructions</h3>
              <div
                className="car-instructions"
                dangerouslySetInnerHTML={{
                  __html: data.getCar.instructions
                }}
              />
            </div>
            <LikeCar _id={_id} />
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(CarPage);
