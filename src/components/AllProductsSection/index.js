import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    categoryOptionId: 0,
    ratingId: 0,
    titleSearchInput: '',
    isChecked: true,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      categoryOptionId,
      ratingId,
      titleSearchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryOptionId}&title_search=${titleSearchInput}&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          isLoading: false,
        })
      }
    } catch (err) {
      this.setState({isChecked: false, isLoading: false})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onChangeCategoryOptionId = categoryOptionId => {
    this.setState({categoryOptionId}, this.getProducts)
  }

  onChangeRatingId = ratingId => {
    this.setState({ratingId}, this.getProducts)
  }

  onChangeTitleSearchInput = titleSearchInput => {
    this.setState({titleSearchInput}, this.getProducts)
  }

  onChangeResetFilter = () => {
    this.setState(
      {categoryOptionId: 0, ratingId: 0, titleSearchInput: ''},
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    if (productsList.length < 1) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
          />
          <h1>No Products Found</h1>
          <p>We could not find any products. Try other filters.</p>
        </div>
      )
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops! Something went wrong </h1>
      <p>We are having some trouble processing your request</p>
    </div>
  )

  render() {
    const {isLoading, ratingId, categoryOptionId, isChecked} = this.state

    let content
    if (isLoading) {
      content = this.renderLoader()
    } else if (!isChecked) {
      content = this.renderFailureView()
    } else {
      content = this.renderProductsList()
    }

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          ratingId={ratingId}
          categoryOptionId={categoryOptionId}
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          onChangeRatingId={this.onChangeRatingId}
          onChangeCategoryOptionId={this.onChangeCategoryOptionId}
          onChangeTitleSearchInput={this.onChangeTitleSearchInput}
          onChangeResetFilter={this.onChangeResetFilter}
        />

        {content}
      </div>
    )
  }
}

export default AllProductsSection
