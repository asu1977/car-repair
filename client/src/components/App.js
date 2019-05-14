import React from 'react';
import './App.css';
import posed from 'react-pose';

import { Query } from 'react-apollo';
import { GET_ALL_CARS } from '../queries';
import CarItem from './Car/CarItem';
import Spinner from './Spinner';

const CarList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100
  },
  hidden: {
    x: '-100%'
  }
});

class App extends React.Component {
  state = {
    on: false
  };

  componentDidMount() {
    setTimeout(this.slideIn, 200);
  }

  slideIn = () => {
    this.setState({ on: !this.state.on });
  };

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Find Cars You <strong>Repair</strong>
        </h1>
        <Query query={GET_ALL_CARS}>
          {({ data, loading, error }) => {
            if (loading) return < Spinner />;
            if (error) return <div>Error</div>;
            // console.log(data);
            const { on } = this.state;
            return (
              <CarList pose={on ? 'shown' : 'hidden'} className="cards">
                {data.getAllCars.map(car => (
                  <CarItem key={car._id} {...car} />
                ))}
              </CarList>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default App;
