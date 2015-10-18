(function () {
	var ready = function (fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	};

	INSTALL_OPTIONS['width'] = Math.max(Math.min(INSTALL_OPTIONS['width'], 500), 200);
	var positionParts = INSTALL_OPTIONS['position'].split('-');

	ready(function () {
		var sqrt2 = Math.sqrt(2), ribbon;
		if(INSTALL_OPTIONS['link']) {
			ribbon = document.createElement("a");
			ribbon.setAttribute('href', INSTALL_OPTIONS['link']);
			if(INSTALL_OPTIONS['new_tab']) {
				ribbon.setAttribute('target', '_blank');
			}
		} else {
			ribbon = document.createElement("div");
		}
		ribbon.innerHTML = INSTALL_OPTIONS['text'];
		ribbon.setAttribute('class', 'corner-ribbon');
		ribbon.setAttribute('style', 'width: ' + (parseInt(INSTALL_OPTIONS['width']) * sqrt2) + 'px; color: ' + INSTALL_OPTIONS['text-color'] + '; background-color: ' + INSTALL_OPTIONS['ribbon-color'] + ';');
		var ribbonWrapper = document.createElement("div");
		ribbonWrapper.setAttribute('class', 'corner-ribbon-wrapper ' + INSTALL_OPTIONS['position'] + ' ' + INSTALL_OPTIONS['font-size']);
		ribbonWrapper.setAttribute('style', 'z-index: ' + (getMaxZIndex() + 1) + '; width: ' + INSTALL_OPTIONS['width'] + 'px; height: ' + INSTALL_OPTIONS['width'] + 'px;');
		ribbonWrapper.appendChild(ribbon);
		document.body.appendChild(ribbonWrapper);
		var s = window.getComputedStyle(ribbonWrapper, null);
		var font = s.getPropertyValue("font-size") + " " + s.getPropertyValue("font-family");
		var words = [];
		INSTALL_OPTIONS['text'].split(' ').forEach(function (word) {
			words.push({text: word, width: getTextWidth(word, font)});
		});
		var textSize = measureText(INSTALL_OPTIONS['text'], s.getPropertyValue("font-size"), '');
		var rowCount = Math.ceil(textSize.width / INSTALL_OPTIONS['width']),
			rowWidth = 0, row = [], rows = [], word = 0;
		while(rows.length < rowCount && word < words.length) {
			if( rowWidth + words[word].width  >= INSTALL_OPTIONS['width'] - (positionParts[0] === 'top' ? rowCount - rows.length : rows.length) * 2 * textSize.height
				&& (rows.length + 1) * textSize.height + 20 < INSTALL_OPTIONS['width']) {
				rows.push(row.join(' '));
				rowWidth = 0;
				row = [];
			}
			rowWidth += words[word].width;
			row.push(words[word].text);
			word++;
		}
		if(row.length) {
			if(rows.length < rowCount && (rows.length + 1) * textSize.height + 20 < INSTALL_OPTIONS['width']) {
				rows.push(row.join(' '));
			} else {
				rows[rows.length - 1] += ' ...';
			}
		}
		ribbon.innerHTML = rows.join('<br />');
		
		var deviation = ((ribbon.clientWidth / 2 + ribbon.clientHeight / 2) / sqrt2) - ribbon.clientHeight * sqrt2;
		if(positionParts[0] === 'top') {
			ribbon.style.top = deviation + 'px';
		} else {
			ribbon.style.bottom = deviation + 'px';
		}
		if(positionParts[1] === 'right') {
			ribbon.style.right = (((INSTALL_OPTIONS['width'] - 1000) / 1000) * deviation - ribbon.clientHeight * sqrt2 / 2).toFixed(2) + 'px';
		} else {
			ribbon.style.left = (((INSTALL_OPTIONS['width'] - 1000) / 1000) * deviation - ribbon.clientHeight * sqrt2 / 2).toFixed(2) + 'px';
		}
	});

	function getTextWidth(text, font) {
		var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
		var context = canvas.getContext("2d");
		context.font = font;
		var metrics = context.measureText(text);
		return metrics.width;
	}

	function measureText(pText, pFontSize, pStyle) {
		var lDiv = document.createElement('lDiv');

		document.body.appendChild(lDiv);

		if (pStyle != null) {
			lDiv.style = pStyle;
		}
		lDiv.style.fontSize = "" + pFontSize + "px";
		lDiv.style.position = "absolute";
		lDiv.style.left = -1000;
		lDiv.style.top = -1000;

		lDiv.innerHTML = pText;

		var lResult = {
			width: lDiv.clientWidth,
			height: lDiv.clientHeight
		};

		document.body.removeChild(lDiv);
		lDiv = null;

		return lResult;
	}

	var getMaxZIndex = function () {
		var zIndex, maxZ = 0,
			all = document.getElementsByTagName('*');
		for (var i = 0, n = all.length; i < n; i++) {
			zIndex = document.defaultView.getComputedStyle(all[i], null).getPropertyValue("z-index");
			zIndex = parseInt(zIndex, 10);
			maxZ = (zIndex) ? Math.max(maxZ, zIndex) : maxZ;
		}
		return maxZ;
	};
})();