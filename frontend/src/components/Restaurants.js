import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import DropSearch from './DropSearch'
import LoaderSpinner from './LoaderSpinner'
// import auth from '../lib/auth'


class Restaurants extends React.Component {
  constructor() {
    super()
    this.state = {
      restaurants: null, //array of all restaurants, NEVER FILTERED!!! 
      filteredRestaurants: null, //array of filtered restaurants, updates when either dropdown or searchbar is used (or both)
      searchText: '',  //what's type into the searchbar 
      // cuisine: 'Search All', //not used 
      dropDownOption: ''
    }
  }

  componentDidMount() {
    // if (!auth.isAuthenticated()) {
    //   auth.logout()
    // }
    axios.get('/api/restaurants')
      .then((resp) => this.setState({
        restaurants: resp.data,
        filteredRestaurants: resp.data
      }))
      .catch(err => console.error(err))
  }

  handleSearch(event) { //handles search bar
    this.setState({ searchText: event.target.value.toLowerCase() }) //event.target.value is what's typed into the searchbar 
    if (!this.state.dropDownOption) { //if only the searchbar is used 
      const onlySearched = this.state.restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(event.target.value.toLowerCase())
      })
      this.setState({ filteredRestaurants: onlySearched })
    } else { //if both searchbar and dropdown is used 
      const bothUsed = this.state.restaurants.filter(restaurant => {
        return (restaurant.cuisine.includes(this.state.dropDownOption) && restaurant.name.toLowerCase().includes(event.target.value))
      })
      this.setState({ filteredRestaurants: bothUsed })
    }
  }

  handleDropdown(event) { //handles dropdowm 

    this.setState({ dropDownOption: event.target.value })
    if (!this.state.searchText) { //if only dropdown is used 
      const onlyDropdownSelected = this.state.restaurants.filter(restaurant => {
        return restaurant.cuisine.includes(event.target.value)
      })
      this.setState({ filteredRestaurants: onlyDropdownSelected })
    } else { //if both dropdown and searchbar is USED 
      const bothUsed = this.state.restaurants.filter(restaurant => {
        return (restaurant.cuisine.includes(event.target.value) && restaurant.name.toLowerCase().includes(this.state.searchText))
      })
      this.setState({ filteredRestaurants: bothUsed })
    }

    if (event.target.value === 'Search All') {
      if (!this.state.searchText) { //if nothing in both dropdown and searchtext 
        this.setState({ filteredRestaurants: this.state.restaurants })
      } else { //if nothing in dropdown and something in searchtext 
        const onlySearched = this.state.restaurants.filter(restaurant => {
          return restaurant.name.toLowerCase().includes(this.state.searchText.toLowerCase())
        })
        this.setState({ filteredRestaurants: onlySearched })
      }
    }

  }

  render() {
    if (!this.state.restaurants) return <LoaderSpinner />
    return <div className="allrestaurantsbackground">
      <div className="container">
        <SearchBar query={this.state.query} onChange={() => this.handleSearch(event)} />
        <DropSearch handleDropdown={() => this.handleDropdown(event)} />

        <div className="columns is-full-mobile is-multiline is-centered mobile-padding">

          {this.state.filteredRestaurants.map(restaurant => {
            return <Link key={restaurant._id} className="column is-one-quarter-desktop is-one-third-tablet is-full-mobile" to={`/restaurant/${restaurant._id}`}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={restaurant.image} alt="Placeholder image" className="resImage" />


                    <div className="card-content">
                      <div className="white">{restaurant.name}</div>
                      <p className="subtitle">{restaurant.address}</p>
                    </div>
                  </figure>
                </div>
              </div>
            </Link>
          })}
        </div>
      </div>
    </div>
  }
}
export default Restaurants