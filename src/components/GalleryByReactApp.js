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
/*
 * 获取区间内的一个随机值
 */
 function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
 }
var ImgFigure = React.createClass({
	render: function () {
		/*
		 * 生成完随机数，调用imgFigures也加入这些位置随机数后
		 * 在imgFigure component里拿到这些信息。声明一个styleObj
		 */
		var styleObj = {};

		//如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
			);

	}
});

var GalleryByReactApp = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {//水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {//垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},
	/*
	 * 重新布局所有图片
	 * 随意的布局，生成随意的left，top值
	 * @param centerIndex 指定居中哪个图片
	 */
	rearrange: function (centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,//这里imgsArrangeArr看一下是什么
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeLeftSecX = hPosRange.leftSecX,
		hPosRangeRightSecX = hPosRange.rightSecX,
		hPosRangeY = hPosRange.y,
		vPosRangeTopY = vPosRange.topY,
		vPosRangeX = vPosRange.x,
		/*
		 * 生成一个数组对象imgsArrangeTopArr，用来存储布局在上区图片的状态信息。
		 * 我们会从整个图片数组中取0-1张图片，放到上侧区域
		 */
		imgsArrangeTopArr = [],
		//【0，2）左闭右开，向下取整就是0-1
		topImgNum = Math.ceil(Math.random() * 2),	//取一个或者不取
		//用来标记布局在上侧的图片是从数组对象的哪个位置拿出来的
		topImgSpliceIndex = 0,
		//数组对象，用来存放居中图片的状态信息
		//imgsArrangeArr用来存放所有图片的状态信息
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);//这个值是一个还是一组？

		//首先居中centerIndex的图片
		imgsArrangeCenterArr[0].pos = centerPos;

		/*
		 * 取出要布局上侧的图片的状态信息，以后会继续扩展这个状态，不止包含位置
		 * 下面计算一个随机数，从imgsArrangeArr中定位取出要定位在上侧的图片状态信息
		 */
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		//取出要布局上侧的位置信息
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		/*
		 * 布局位于上侧的图片
		 * 不管imgsArrangeTopArr有没有值，调用forEach总不会出错。如果数组中没值就不会进入到forEach的处理函数中
		 */
		imgsArrangeTopArr.forEach(function (value, index) {
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			};
		});

		/*
		 * 布局左右两侧的图片
		 * imgsArrangeArr已经踢掉布局中间和上侧的图片，剩下的就都是左右两侧的图片
		 */
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			//左区域或者右区域x的取值范围
			var hPosRangeLORX = null;

			//前半部分布局左边，后半部分布局右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imgsArrangeArr[i].pos = {
				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
				left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
			};

		}
		//位置信息都处理完了，该生成的随机数都生成了，下面把他们重新合并回来
		//如果上部有图片就把它重新塞回数组里
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		//中间图片塞回数组
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		//最后设置state，可以触发component的重新渲染
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
		//随意布局的值生成好了，下面就是使用这些随意布局的值。怎么使用呢，我们在调用imgFigures component的时候，
		//将这些信息传递进imgFigure component。见imgFigures.push
	},

	getInitialState: function () {
		return {
			/*
			 * 因为要存储多个图片的状态，所以这边使用一个数组。
			 * 每一个数组元素都认为是一个状态对象，其中就包含位置信息
			 * 位置信息放在键值pos中
			 * 这样就可以把object作为一个css style使用了
			 * 接下来初始化每一个这样的状态对象
			 * 初始化放在render函数中，以便让imgsArrangeArr数组中的每一个状态对象能够跟imageDatas中的每一个真实的数据对象的索引对应起来。
			 */
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					}
				}*/
			]
		};
	},
	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount: function () {
		//首先拿到舞台的大小
		var stageDOM = React.findDOMNode(this.refs.stage),
		stageW = stageDOM.scrollWidth,
		stageH = stageDOM.scrollHeight,
		halfStageW = Math.ceil(stageW / 2),
		halfStageH = Math.ceil(stageH / 2);

		//拿到一个imageFigure的大小
		/*
		 * scrollWidth是对象实际内容的宽度，不包含滚动条等边境宽度，会随内容超过可视区域后而变大
		 * clientWidth是对象的可视区域的宽度，不包含滚动条的边线，会随对象显示大小的改变而改变
		 * offsetWidth是对象整体的实际宽度，包含滚动条，会随对象显示大小而改变
		 */
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDOM.scrollWidth,
		imgH = imgFigureDOM.scrollHeight,
		halfImgW = Math.ceil(imgW / 2),
		halfImgH = Math.ceil(imgH / 2);

		//计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};
		//计算左侧，右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		/*
		 * 指定图片中第一张居中。同时大管家还要管理每一张图片和每一个操作按钮的状态。
		 * 这些状态一旦变化，视图是要重新排布的，所以把状态存储在GalleryByReact component的state中
		 * 见getInitialState
		 */
		this.rearrange(0);
	},

  render: function() {

	var controllerUnits = [],
		imgFigures = [];

	imageDatas.forEach(function (value, index) {
		/*
		 * 如果当前没有这个状态对象，就初始化
		 * 初始化到了左上角
		 * 那么随意的布局应该在哪里做呢
		 * 随意的布局，生成随意的left，top值，我们在rearrange里面写
		 */
		if (!this.state.imgsArrangeArr[index]) {
			this.state.imgsArrangeArr[index] = {
				pos: {
					left: 0,
					top: 0
				}
			};
		}
		/*
		 * 这时候为function绑定bind(this),把react component对象传递到function中
		 * 我们在调用imgFigures component的时候，将这些信息传递进imgFigure component，给它一个属性叫arrange
		 * 注意对应上数组元素的index，这样就把每张图片的状态信息传递给了imgFigure component
		 * 在imgFigure component里拿到这个信息。声明一个styleObj
		 */
		imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
	}.bind(this));
    return (
		<section className="stage" ref="stage">
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
