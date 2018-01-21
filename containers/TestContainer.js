import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as processorActions from "../ducks/processors";
import Home from "../components/Home";
import "../style/Processors.less";
import * as R from 'ramda';

const format = new ol.format.GeoJSON();

const processorStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255, 0, 0, 0.1)"
  }),
  stroke: new ol.style.Stroke({
    color: "#f00",
    width: 1
  })
});

const newPredicateStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(0, 0, 255, 0.1)"
  }),
  stroke: new ol.style.Stroke({
    color: "#00f",
    width: 1
  })
});

class TestContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: "",
      coords:[0,0]
    };

    this.updateCoords = this.updateCoords.bind(this);
    this.toggleSubmit = this.toggleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.createMap();
    window.addEventListener("resize", () => {
      this.createMap();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.menu.open !== nextProps.menu.open) {
      // wait for menu to transition
      setTimeout(() => this.map.updateSize(), 200);
    }
  }

  onChange(e) {
    this.setState({ val: e.target.value });
  }

  toggleSubmit() {
    const submitting = !this.state.submitting;
    if (submitting) {
      this.map.addInteraction(this.create);
    } else {
      this.map.removeInteraction(this.create);
    }
    this.setState({ submitting });
  }

  updateCoords(evt) {
    const coords = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    this.setState({coords})
    this.props.actions.testPoint({
      type:"Feature",
      geometry: {
        type: "Point",
        coordinates: coords
      },
      id: "test-point",
      properties:{}
    });
    setTimeout(() => this.setState({coords:[0,0]}),3000)
  }

  createMap() {
    while (this.mapRef.firstChild) {
      this.mapRef.removeChild(this.mapRef.firstChild);
    }
    this.map = new ol.Map({
      target: this.mapRef,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-100, 30]),
        zoom: 3
      })
    });
    this.map.on('click',this.updateCoords);
  }

  render() {
    return (
      <div className="wrapper">
        <div className="main">
          <div className="processor-details">
            <div className="processor-props">
              <label htmlFor="recipients">Test</label>
              <p>
              {this.state.coords[0] !== 0 ?
                'Sending:' + this.state.coords :
                'Click to send test point'
              }</p>
            </div>
            <div
              className="processor-map"
              ref={c => {
                this.mapRef = c;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

TestContainer.propTypes = {
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  spatial_processors: state.sc.processors.spatial_processors
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(processorActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);
