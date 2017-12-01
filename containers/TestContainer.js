import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as processorActions from "../ducks/processors";
import Home from "../components/Home";
import "../style/Processors.less";

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
      submitting: false
    };

    this.toggleSubmit = this.toggleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.createMap();
    window.addEventListener("resize", () => {
      console.log("cdm");
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

  createMap() {
    while (this.mapRef.firstChild) {
      this.mapRef.removeChild(this.mapRef.firstChild);
    }
    this.newSubmissionSource = new ol.source.Vector();
    const newPredicateLayer = new ol.layer.Vector({
      source: this.newSubmissionSource,
      style: newPredicateStyle
    });
    this.select = new ol.interaction.Select({
      wrapX: false,
      style: newPredicateStyle
    });
    this.create = new ol.interaction.Draw({
      source: this.newSubmissionSource,
      type: "Point"
    });
    this.map = new ol.Map({
      target: this.mapRef,
      interactions: ol.interaction.defaults().extend([this.select]),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        newPredicateLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([-100, 30]),
        zoom: 3
      })
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="main">
          <div className="processor-details">
            <div className="processor-props">
              <label htmlFor="recipients">Test</label>
              <p>Click to send test point</p>
            </div>
            <div
              className="processor-map"
              ref={c => {
                this.mapRef = c;
              }}
            />
            <div className="btn-toolbar">
              <button className="btn btn-sc" onClick={this.toggleSubmit}>
                {!this.state.submitting ? "Enable" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TestContainer.propTypes = {
  processorActions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  spatial_processors: state.sc.processors.spatial_processors
});

const mapDispatchToProps = dispatch => ({
  processorActions: bindActionCreators(processorActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);
