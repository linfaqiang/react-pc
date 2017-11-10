import React from 'react'
import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

export default class Loading extends React.Component{

  render() {

    return (
          <div className="loading-container">
              <div className="loading-progress">
                  <div className="rotator">
                      <div className="rotator">
                          <div className="rotator colored">
                              <div className="rotator">
                                  <div className="rotator colored">
                                      <div className="rotator colored"></div>
                                      <div className="rotator"></div>
                                  </div>
                                  <div className="rotator colored"></div>
                              </div>
                              <div className="rotator"></div>
                          </div>
                          <div className="rotator"></div>
                      </div>
                      <div className="rotator"></div>
                  </div>
                  <div className="rotator"></div>
              </div>
          </div>
    )
  }
}