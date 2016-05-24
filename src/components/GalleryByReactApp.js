'use strict';

var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.scss');

var imageDatas = require('../data/imageDatas.json');

imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

var ImgFigure = React.createClass({
	render: function () {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
			);

	}
});

var GalleryByReactApp = React.createClass({
  render: function() {

	var controllerUnits = [],
		imgFigures = [];

	imageDatas.forEach(function (value) {
		imgFigures.push(<ImgFigure data={value}/>);
	});
    return (
		<section className="stage">
			<section className="img-sec">
			{imgFigures}
			</section>
			<nav className="controller-nav">
			{controllerUnits}
			</nav>
		</section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
