import React, { Component, PropTypes } from "react";
import Dropzone from "react-dropzone";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import ProcessorItem from "./ProcessorItem";
import { ProcessorForm } from "./ProcessorForm";
import PropertyListItem from "./PropertyListItem";
import "../style/Processors.less";
import * as R from "ramda";

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

class ProcessorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingPredicate: false,
      editing: false,
      editingPredicate: false,
      editingProcessor: false,
      creating: false,
      drawing: false,
      uploading: false,
      fileUploaded: false,
      uploadedFile: false,
      uploadErr: false,
      predicate_comparator: "$geowithin",
      activePredicates: {}
    };
    this.predicateLayers = {};
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDraw = this.onDraw.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onAddPredicate = this.onAddPredicate.bind(this);
    this.onPredicateComparatorChange = this.onPredicateComparatorChange.bind(
      this
    );
    this.onEditProcessor = this.onEditProcessor.bind(this);
    this.onCancelEditProcessor = this.onCancelEditProcessor.bind(this);
    this.onEditProcessorSave = this.onEditProcessorSave.bind(this);
    this.togglePredicate = this.togglePredicate.bind(this);
    this.onEditPredicate = this.onEditPredicate.bind(this);
    this.onDeletePredicate = this.onDeletePredicate.bind(this);
  }

  componentDidMount() {
    this.createMap();
    window.addEventListener("resize", () => {
      this.createMap();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(nextProps.processor.predicates, this.props.processor.predicates)
    ) {
      this.addPredicates(nextProps.processor);
    }
    if (this.props.menu.open !== nextProps.menu.open) {
      // wait for menu to transition
      setTimeout(() => this.map.updateSize(), 200);
    }
  }

  onCancel() {
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.create);
    this.select.getFeatures().clear();
    this.newPredicateSource.clear();
    this.setState({
      editing: false,
      creating: false,
      drawing: false,
      uploading: false,
      fileUploaded: false,
      uploadErr: false,
      uploadedFile: false,
      editingPredicate: false,
      editingProcessor: false
    });
  }

  onSave() {
    this.setState({
      editing: false,
      creating: false,
      drawing: false,
      uploading: false,
      uploadedFile: false
    });
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.create);
    this.select.getFeatures().clear();
    const fcId = `${this.props.processor.id}.${this.props.processor.predicates
      .length + 1}`;
    const fs = this.newPredicateSource.getFeatures().map((f, i) => {
      f.setId(`${fcId}.${i}`);
      return f;
    });
    const gj = JSON.parse(
      format.writeFeatures(fs, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      })
    );
    gj.id = fcId;
    gj.features = gj.features.map(f => ({
      ...f,
      properties: {}
    }));
    const newPredicate = {
      lhs: ["geometry"],
      comparator: this.state.predicate_comparator,
      rhs: gj,
      id: Date.now()
    };
    const newProcessor = {
      ...this.props.processor,
      predicates: this.props.processor.predicates
        ? this.props.processor.predicates.concat(newPredicate)
        : [newPredicate]
    };
    this.newPredicateSource.clear();
    this.props.actions.updateProcessor(newProcessor);
  }

  onDraw() {
    this.setState({ drawing: true });
    this.map.addInteraction(this.create);
  }

  onUpload() {
    this.setState({ uploading: true });
  }

  onDrop(acceptedFiles) {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const gj = JSON.parse(e.target.result);
          this.setState({
            uploadErr: false,
            uploadedFile: file.name
          });
          const features = format.readFeatures(gj);
          features.forEach(feature => {
            feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
            this.newPredicateSource.addFeature(feature);
          });
          this.map
            .getView()
            .fit(this.newPredicateSource.getExtent(), this.map.getSize());
        } catch (err) {
          this.setState({ uploadErr: "Not valid GeoJSON" });
        }
      };
      reader.readAsText(file);
    }
  }

  onDelete() {
    this.props.actions.deleteProcessor(this.props.processor);
  }

  onPredicateComparatorChange(e) {
    this.setState({
      predicate_comparator: e.target.value
    });
  }

  onAddPredicate() {
    this.setState({ creating: true });
  }

  onEditProcessor() {
    this.setState({ editingProcessor: true });
  }

  onCancelEditProcessor() {
    this.setState({ editingProcessor: false }, () => {
      this.createMap();
    });
  }

  onEditProcessorSave(processor) {
    this.props.actions.updateProcessor(processor);
    this.setState({ editingProcessor: false }, () => {
      this.createMap();
    });
  }

  onEditPredicate(predicate) {
    const layer = this.predicateLayers[predicate.id];
    const fs = layer
      .getSource()
      .getFeatures()
      .map(f => f.clone());
    this.setState({ editingPredicate: predicate.id });
    this.select.getFeatures().clear();
    this.newPredicateSource.clear();
    this.map.getView().fit(layer.getSource().getExtent(), this.map.getSize());
    this.map.removeLayer(layer);
    this.newPredicateSource.addFeatures(fs);
    this.modify = new ol.interaction.Modify({
      features: new ol.Collection(this.newPredicateSource.getFeatures())
    });
    this.map.addInteraction(this.modify);
  }

  onSavePredicate(predicate) {
    const fcId = `${this.props.processor.id}.${predicate.id}`;
    const fs = this.newPredicateSource.getFeatures().map((f, i) => {
      f.setId(`${fcId}.${i}`);
      return f;
    });
    const gj = JSON.parse(
      format.writeFeatures(fs, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      })
    );
    gj.id = fcId;
    gj.features = gj.features.map(f => ({
      ...f,
      properties: {}
    }));
    const newPredicate = {
      ...predicate,
      rhs: gj
    };
    const newProcessor = {
      ...this.props.processor,
      predicates: this.props.processor.predicates.map(r => {
        if (r.id === newPredicate.id) {
          return newPredicate;
        }
        return r;
      })
    };
    this.setState({
      editingPredicate: false
    });
    this.map.removeInteraction(this.modify);
    this.newPredicateSource.clear();
    this.props.actions.updateProcessor(newProcessor);
  }

  onDeletePredicate(predicate) {
    const predicates = this.props.processor.definition.predicates.filter(
      r => r.id !== predicate.id
    );
    const newProcessor = R.assocPath(
      ["definition", "predicates"],
      R.reject(
        p => p.id === predicate.id,
        this.props.processor.definition.predicates
      ),
      this.props.processor
    );
    this.select.getFeatures().clear();
    this.props.actions.updateProcessor(newProcessor);
  }

  onCancelPredicate(predicate) {
    const layer = this.predicateLayers[predicate.id];
    this.map.removeInteraction(this.modify);
    this.newPredicateSource.clear();
    this.map.addLayer(layer);
    this.setState({
      editingPredicate: false
    });
  }

  createMap() {
    while (this.mapRef.firstChild) {
      this.mapRef.removeChild(this.mapRef.firstChild);
    }
    this.allPredicateSource = new ol.source.Vector();
    this.newPredicateSource = new ol.source.Vector();
    const newPredicateLayer = new ol.layer.Vector({
      source: this.newPredicateSource,
      style: newPredicateStyle
    });
    this.select = new ol.interaction.Select({
      wrapX: false,
      style: newPredicateStyle
    });
    this.modify = new ol.interaction.Modify({
      features: new ol.Collection(this.newPredicateSource.getFeatures())
    });
    this.create = new ol.interaction.Draw({
      source: this.newPredicateSource,
      type: "Polygon"
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

    this.addPredicates(this.props.processor);
  }

  addPredicates(processor) {
    Object.keys(this.predicateLayers).forEach(layerid =>
      this.map.removeLayer(this.predicateLayers[layerid])
    );
    this.predicateLayers = {};
    if (processor.predicates && processor.predicates.length) {
      processor.predicates.forEach(predicate => {
        if (predicate.comparator === "$geowithin") {
          this.addPredicate(predicate);
        }
      });
      this.map
        .getView()
        .fit(this.allPredicateSource.getExtent(), this.map.getSize());
    }
  }

  addPredicate(predicate) {
    if (isEmpty(predicate.rhs)) return;
    const predicateSource = new ol.source.Vector();
    const features = format.readFeatures(predicate.rhs);
    features.forEach(feature => {
      feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
      predicateSource.addFeature(feature);
      this.allPredicateSource.addFeature(feature);
    });
    const layer = new ol.layer.Vector({
      source: predicateSource,
      style: processorStyle
    });
    this.predicateLayers[predicate.id] = layer;
    this.map.addLayer(layer);
    this.setState(prevState => ({
      activePredicates: {
        ...prevState.activePredicates,
        [predicate.id]: true
      }
    }));
  }

  togglePredicate(predicate) {
    if (this.predicateLayers[predicate.id]) {
      const layer = this.predicateLayers[predicate.id];
      const active = this.state.activePredicates[predicate.id];
      if (active) {
        this.map.removeLayer(layer);
      } else {
        this.map.addLayer(layer);
      }
      this.setState(prevState => ({
        activePredicates: {
          ...prevState.activePredicates,
          [predicate.id]: !active
        }
      }));
    }
  }

  viewPredicate(predicate) {
    if (this.predicateLayers[predicate.id]) {
      const layer = this.predicateLayers[predicate.id];
      const fs = layer.getSource().getFeatures();
      this.map.getView().fit(layer.getSource().getExtent(), this.map.getSize());
      this.select.getFeatures().clear();
      fs.forEach(f => this.select.getFeatures().push(f));
    }
  }

  renderPredicates() {
    const predicateList =
      this.props.processor.definition.predicates === undefined ||
      this.props.processor.definition.predicates.length === 0 ? (
        <span className="note">
          No predicates have been added to this processor.
        </span>
      ) : (
        this.props.processor.definition.predicates.map(p => (
          <div className="form-item mini">
            <div className="properties">
              <PropertyListItem name={"Type"} value={p.type} />
            </div>
            {this.state.editingPredicate === p.id ? (
              <div className="btn-toolbar plain">
                <span
                  className="btn-plain"
                  onClick={() => this.onSavePredicate(p)}
                >
                  Save
                </span>
                <span
                  className="btn-plain"
                  onClick={() => this.onCancelPredicate(p)}
                >
                  Cancel
                </span>
              </div>
            ) : (
              <div className="btn-toolbar plain">
                <span
                  className="btn-plain"
                  onClick={() => this.viewPredicate(p)}
                >
                  View
                </span>
                <span
                  className="btn-plain"
                  onClick={() => this.onEditPredicate(p)}
                >
                  Edit
                </span>
                <span
                  className="btn-plain"
                  onClick={() => this.onDeletePredicate(p)}
                >
                  Delete
                </span>
              </div>
            )}
          </div>
        ))
      );
    return (
      <div>
        <h4>Predicates</h4>
        <div className="predicate-list">{predicateList}</div>
        {!this.state.creating && (
          <div className="btn-toolbar">
            <button className="btn btn-sc" onClick={this.onAddPredicate}>
              Add Predicate
            </button>
          </div>
        )}
      </div>
    );
  }

  renderEditing() {
    return (
      <div>
        <div className="btn-toolbar">
          <button className="btn btn-sc" onClick={this.onEditProcessor}>
            Edit Processor
          </button>
          <button className="btn btn-danger" onClick={this.onDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  renderCreating() {
    const uploading = this.state.uploadedFile ? (
      <span>{this.state.uploadedFile}</span>
    ) : (
      <div>
        <Dropzone
          onDrop={this.onDrop}
          multiple={false}
          className="drop-zone"
          activeClassName="drop-zone-active"
        >
          <div>
            <span>Drop file here, or click to select file to upload.</span>
            <br />
            <br />
            <span>GeoJSON files accepted.</span>
          </div>
        </Dropzone>
        {!!this.state.uploadErr && <p>{this.state.uploadErr}</p>}
      </div>
    );
    const done = (
      <div className="btn-toolbar">
        <button className="btn btn-sc" onClick={this.onSave}>
          Save
        </button>
        <button className="btn btn-sc" onClick={this.onCancel}>
          Cancel
        </button>
      </div>
    );
    if (this.state.creating) {
      return (
        <div className="add-predicate">
          <h4>Add Predicate</h4>
          <div className="form-group">
            <label htmlFor="comparator">Predicate Type:</label>
            <select
              id="comparator"
              className="form-control"
              value={this.state.predicate_comparator}
              onChange={this.onPredicateComparatorChange}
            >
              <option value="$geowithin">geowithin</option>
            </select>
          </div>
          {this.state.drawing && done}
          {this.state.uploading && (
            <div>
              {uploading}
              {done}
            </div>
          )}
          {!this.state.drawing &&
            !this.state.uploading && (
              <div>
                <div className="btn-toolbar">
                  <button className="btn btn-sc" onClick={this.onDraw}>
                    Draw
                  </button>
                  <button className="btn btn-sc" onClick={this.onUpload}>
                    Upload
                  </button>
                </div>
                <div className="btn-toolbar">
                  <button className="btn btn-default" onClick={this.onCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
        </div>
      );
    }
    return null;
  }

  render() {
    const { processor } = this.props;
    if (this.state.editingProcessor) {
      return (
        <div className="wrapper">
          <section className="main">
            <ProcessorForm
              processor={processor}
              cancel={this.onCancelEditProcessor}
              onSave={this.onEditProcessorSave}
              errors={this.props.errors}
              actions={this.props.actions}
              capabilities={this.props.capabilities}
            />
          </section>
        </div>
      );
    }
    return (
      <div className="processor-details">
        <div className="processor-props">
          <ProcessorItem processor={processor} />
          {this.renderEditing()}
          {this.renderPredicates()}
          {this.renderCreating()}
        </div>
        <div
          className="processor-map"
          ref={c => {
            this.mapRef = c;
          }}
        />
      </div>
    );
  }
}

ProcessorDetails.propTypes = {
  processor: PropTypes.object.isRequired,
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default ProcessorDetails;
