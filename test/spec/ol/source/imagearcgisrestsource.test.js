goog.provide('ol.test.source.ImageArcGISRest');


describe('ol.source.ImageArcGISRest', function() {

  var extent, pixelRatio, options, projection, resolution;
  beforeEach(function() {
    extent = [10, 20, 30, 40];
    pixelRatio = 1;
    projection = ol.proj.get('EPSG:4326');
    resolution = 0.1;
    options = {
      params: {},
      ratio: 1,
      url: 'http://example.com/MapServer'
    };
  });

  describe('#getImage', function() {

    it('returns the expected image URL', function() {
      var source = new ol.source.ImageArcGISRest(options);
      var image = source.getImage(extent, resolution, pixelRatio, projection);
      var uri = new goog.Uri(image.src_);
      expect(uri.getScheme()).to.be('http');
      expect(uri.getDomain()).to.be('example.com');
      expect(uri.getPath()).to.be('/MapServer');
      var queryData = uri.getQueryData();
      expect(queryData.get('BBOX')).to.be('20,10,40,30');
	  expect(queryData.get('F')).to.be('image');
      expect(queryData.get('FORMAT')).to.be('PNG32');
      expect(queryData.get('TRANSPARENT')).to.be('true');
      expect(uri.getFragment()).to.be.empty();
    });

   
    it('allows various parameters to be overridden', function() {
      options.params.FORMAT = 'png';
      options.params.TRANSPARENT = false;
      var source = new ol.source.ImageArcGISRest(options);
	  var image = source.getImage(extent, resolution, pixelRatio, projection);
      var uri = new goog.Uri(image.src_);
      var queryData = uri.getQueryData();
      expect(queryData.get('FORMAT')).to.be('png');
      expect(queryData.get('TRANSPARENT')).to.be('false');
    });

    it('allows adding rest option', function() {
      options.params.LAYERS = 'show:1,3,4';
      var source = new ol.source.ImageArcGISRest(options);
      var image = source.getImage(extent, resolution, pixelRatio, projection);
      var uri = new goog.Uri(image.src_);
      var queryData = uri.getQueryData();
      expect(queryData.get('LAYERS')).to.be('show:1,3,4');
    });
  });

  describe('#updateParams', function() {

    it('add a new param', function() {
      var source = new ol.source.ImageArcGISRest(options);
      source.updateParams({ 'TEST': 'value' });
	  var image = source.getImage(extent, resolution, pixelRatio, projection);
      var uri = new goog.Uri(image.src_);
      var queryData = uri.getQueryData();
      expect(queryData.get('TEST')).to.be('value');
    });

    it('updates an existing param', function() {
      options.params.TEST = 'value';

      var source = new ol.source.ImageArcGISRest(options);
      source.updateParams({ 'TEST': 'newValue' });

      var image = source.getImage(extent, resolution, pixelRatio, projection);
      var uri = new goog.Uri(image.src_);
	  
      var queryData = uri.getQueryData();

      expect(queryData.get('TEST')).to.be('newValue');
    });

  });

  describe('#getParams', function() {

    it('verify getting a param', function() {
      options.params.TEST = 'value';
      var source = new ol.source.ImageArcGISRest(options);

      var setParams = source.getParams();

      expect(setParams).to.eql({ TEST: 'value' });
    });

    it('verify on adding a param', function() {
      options.params.TEST = 'value';

      var source = new ol.source.ImageArcGISRest(options);
      source.updateParams({ 'TEST2': 'newValue' });

      var setParams = source.getParams();

      expect(setParams).to.eql({ TEST: 'value', TEST2: 'newValue' });
    });

    it('verify on update a param', function() {
      options.params.TEST = 'value';

      var source = new ol.source.ImageArcGISRest(options);
      source.updateParams({ 'TEST': 'newValue' });

      var setParams = source.getParams();

      expect(setParams).to.eql({ TEST: 'newValue' });
    });

  });
  
    it('creates an image with a custom imageLoadFunction', function() {
      var imageLoadFunction = sinon.spy();
      options.imageLoadFunction = imageLoadFunction;
      var source = new ol.source.ImageArcGISRest(options);
      var image = source.getImage(extent, resolution, pixelRatio, projection);
      image.load();
      expect(imageLoadFunction).to.be.called();
      expect(imageLoadFunction.calledWith(image, image.src_)).to.be(true);
    });

});


goog.require('goog.Uri');
goog.require('ol.source.ImageArcGISRest');
goog.require('ol.proj');
