import React from 'react';

import { ApolloConsumer } from 'react-apollo';
import { SEARCH_CARS } from '../../queries';
import SearchItem from './SearchItem';

class Search extends React.Component {
  state = {
    searchResults: []
  };
  
  handleChange = ({ searchCars }) => {
    this.setState({
      searchResults: searchCars
    });
  };

  render() {
    const { searchResults } = this.state;

    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <input
              type="search"
              className="search"
              placeholder="Search for Cars"
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_CARS,
                  variables: { searchTerm: event.target.value }
                });
                this.handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(car => (
                <SearchItem key={car._id} { ...car } />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default Search;
