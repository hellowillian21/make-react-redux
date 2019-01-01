import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connet extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
    constructor() {
      super()
      this.state = { allProps: {} }
    }
    componentWillMount() {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())

    }
    _updateProps() {
      const { store } = this.context
      let stateProps = mapStateToProps ? mapStateToProps(store.getState(), this.props) : {} // 防止mapStateToProps没有传入 //额外传入props，让获取数据更加灵活方便

      let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {} //防止mapDispatchToProps没有传入
      this.setState({
        allProps: { // 整合普通的props和从state生成的props
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }
    render() {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connet
}

export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }

  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return (
      <div>{this.props.children}</div>
    )
  }

}

