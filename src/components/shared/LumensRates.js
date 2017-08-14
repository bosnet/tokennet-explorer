import React from 'react'
import PropTypes from 'prop-types'
import FetchPonyfill from 'fetch-ponyfill'
const fetch = FetchPonyfill().fetch

const FEED_URL = 'https://api.coinmarketcap.com/v1/ticker/stellar/'

class LumensRatesContainer extends React.Component {
  componentDidMount() {
    fetch(FEED_URL)
      .then(rsp => rsp.json())
      .then(rspJson => {
        const lumens = rspJson[0]
        const newState = {
          btc: lumens.price_btc,
          change: lumens.percent_change_24h,
          usd: lumens.price_usd,
        }
        this.setState(newState)
      })
      .catch(err => {
        console.error(`Failed to fetch price: [${err}]`)
        console.error(`stack: [${err.stack}]`)
      })
  }
  render() {
    if (!this.state) return null
    return <LumensRates {...this.state} />
  }
}

class LumensRates extends React.Component {
  isPositive(changeNumStr) {
    const asFloat = Number.parseFloat(changeNumStr)
    return Number.isNaN(asFloat) === false && Number(asFloat) >= 0
  }

  renderChange(change) {
    const positive = this.isPositive(change)
    const valueStr = `${positive ? '+' : ''}${this.props.change}%`
    const style = {
      color: positive ? 'green' : 'red',
    }
    return (
      <span style={style}>
        {valueStr}
      </span>
    )
  }

  render() {
    return (
      <span>
        XLM/USD: {this.props.usd} {this.renderChange(this.props.change)}
      </span>
    )
  }
}

LumensRates.propTypes = {
  change: PropTypes.string.isRequired,
  usd: PropTypes.string.isRequired,
}

export {LumensRatesContainer as default, LumensRates}
