define(['talent'],function(talent) {
	
	/**
	 * jquery.Jcrop.js v0.9.8
	 * jQuery Image Cropping Plugin
	 * @author Kelly Hallman <khallman@gmail.com>
	 * Copyright (c) 2008-2009 Kelly Hallman - released under MIT License {{{
	 *
	 * Permission is hereby granted, free of charge, to any person
	 * obtaining a copy of this software and associated documentation
	 * files (the "Software"), to deal in the Software without
	 * restriction, including without limitation the rights to use,
	 * copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the
	 * Software is furnished to do so, subject to the following
	 * conditions:
	
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	 * OTHER DEALINGS IN THE SOFTWARE.
	
	 * }}}
	 */
	
	(function($) {
	
	$.Jcrop = function(obj,opt)
	{
		// Initialization {{{
	
		// Sanitize some options {{{
		var obj = obj, opt = opt;
	
		if (typeof(obj) !== 'object') obj = $(obj)[0];
		if (typeof(opt) !== 'object') opt = { };
	
		// Some on-the-fly fixes for MSIE...sigh
		if (!('trackDocument' in opt))
		{
			opt.trackDocument = $.browser.msie ? false : true;
			if ($.browser.msie && $.browser.version.split('.')[0] == '8')
				opt.trackDocument = true;
		}
	
		if (!('keySupport' in opt))
				opt.keySupport = $.browser.msie ? false : true;
			
		// }}}
		// Extend the default options {{{
		var defaults = {
	
			// Basic Settings
			trackDocument:		false,
			baseClass:			'jcrop',
			addClass:			null,
	
			// Styling Options
			bgColor:			'black',
			bgOpacity:			.6,
			borderOpacity:		.4,
			handleOpacity:		.5,
	
			handlePad:			5,
			handleSize:			9,
			handleOffset:		5,
			edgeMargin:			14,
	
			aspectRatio:		0,
			keySupport:			true,
			cornerHandles:		true,
			sideHandles:		true,
			drawBorders:		true,
			dragEdges:			true,
	
			boxWidth:			0,
			boxHeight:			0,
	
			boundary:			8,
			animationDelay:		20,
			swingSpeed:			3,
	
			allowSelect:		true,
			allowMove:			true,
			allowResize:		true,
	
			minSelect:			[ 0, 0 ],
			maxSize:			[ 0, 0 ],
			minSize:			[ 0, 0 ],
	
			// Callbacks / Event Handlers
			onChange: function() { },
			onSelect: function() { }
	
		};
		var options = defaults;
		setOptions(opt);
	
		// }}}
		// Initialize some jQuery objects {{{
	
		var $origimg = $(obj);
		var $img = $origimg.clone().removeAttr('id').css({ position: 'absolute' });
	
		$img.width($origimg.width());
		$img.height($origimg.height());
		$origimg.after($img).hide();
	
		presize($img,options.boxWidth,options.boxHeight);
	
		var boundx = $img.width(),
			boundy = $img.height(),
	
			$div = $('<div />')
				.width(boundx).height(boundy)
				.addClass(cssClass('holder'))
				.css({
					position: 'relative',
					backgroundColor: options.bgColor
				}).insertAfter($origimg).append($img);
		;
		
		if (options.addClass) $div.addClass(options.addClass);
		//$img.wrap($div);
	
		var $img2 = $('<img />')/*{{{*/
				.attr('src',$img.attr('src'))
				.css('position','absolute')
				.width(boundx).height(boundy)
		;/*}}}*/
		var $img_holder = $('<div />')/*{{{*/
			.width(pct(100)).height(pct(100))
			.css({
				zIndex: 310,
				position: 'absolute',
				overflow: 'hidden'
			})
			.append($img2)
		;/*}}}*/
		var $hdl_holder = $('<div />')/*{{{*/
			.width(pct(100)).height(pct(100))
			.css('zIndex',320);
		/*}}}*/
		var $sel = $('<div />')/*{{{*/
			.css({
				position: 'absolute',
				zIndex: 300
			})
			.insertBefore($img)
			.append($img_holder,$hdl_holder)
		;/*}}}*/
	
		var bound = options.boundary;
		var $trk = newTracker().width(boundx+(bound*2)).height(boundy+(bound*2))
			.css({ position: 'absolute', top: px(-bound), left: px(-bound), zIndex: 290 })
			.mousedown(newSelection);	
		
		/* }}} */
		// Set more variables {{{
	
		var xlimit, ylimit, xmin, ymin;
		var xscale, yscale, enabled = true;
		var docOffset = getPos($img),
			// Internal states
			btndown, lastcurs, dimmed, animating,
			shift_down;
	
		// }}}
			
	
			// }}}
		// Internal Modules {{{
	
		var Coords = function()/*{{{*/
		{
			var x1 = 0, y1 = 0, x2 = 0, y2 = 0, ox, oy;
	
			function setPressed(pos)/*{{{*/
			{
				var pos = rebound(pos);
				x2 = x1 = pos[0];
				y2 = y1 = pos[1];
			};
			/*}}}*/
			function setCurrent(pos)/*{{{*/
			{
				var pos = rebound(pos);
				ox = pos[0] - x2;
				oy = pos[1] - y2;
				x2 = pos[0];
				y2 = pos[1];
			};
			/*}}}*/
			function getOffset()/*{{{*/
			{
				return [ ox, oy ];
			};
			/*}}}*/
			function moveOffset(offset)/*{{{*/
			{
				var ox = offset[0], oy = offset[1];
	
				if (0 > x1 + ox) ox -= ox + x1;
				if (0 > y1 + oy) oy -= oy + y1;
	
				if (boundy < y2 + oy) oy += boundy - (y2 + oy);
				if (boundx < x2 + ox) ox += boundx - (x2 + ox);
	
				x1 += ox;
				x2 += ox;
				y1 += oy;
				y2 += oy;
			};
			/*}}}*/
			function getCorner(ord)/*{{{*/
			{
				var c = getFixed();
				switch(ord)
				{
					case 'ne': return [ c.x2, c.y ];
					case 'nw': return [ c.x, c.y ];
					case 'se': return [ c.x2, c.y2 ];
					case 'sw': return [ c.x, c.y2 ];
				}
			};
			/*}}}*/
			function getFixed()/*{{{*/
			{
				if (!options.aspectRatio) return getRect();
				// This function could use some optimization I think...
				var aspect = options.aspectRatio,
					min_x = options.minSize[0]/xscale, 
					min_y = options.minSize[1]/yscale,
					max_x = options.maxSize[0]/xscale, 
					max_y = options.maxSize[1]/yscale,
					rw = x2 - x1,
					rh = y2 - y1,
					rwa = Math.abs(rw),
					rha = Math.abs(rh),
					real_ratio = rwa / rha,
					xx, yy
				;
				if (max_x == 0) { max_x = boundx * 10 }
				if (max_y == 0) { max_y = boundy * 10 }
				if (real_ratio < aspect)
				{
					yy = y2;
					w = rha * aspect;
					xx = rw < 0 ? x1 - w : w + x1;
	
					if (xx < 0)
					{
						xx = 0;
						h = Math.abs((xx - x1) / aspect);
						yy = rh < 0 ? y1 - h: h + y1;
					}
					else if (xx > boundx)
					{
						xx = boundx;
						h = Math.abs((xx - x1) / aspect);
						yy = rh < 0 ? y1 - h : h + y1;
					}
				}
				else
				{
					xx = x2;
					h = rwa / aspect;
					yy = rh < 0 ? y1 - h : y1 + h;
					if (yy < 0)
					{
						yy = 0;
						w = Math.abs((yy - y1) * aspect);
						xx = rw < 0 ? x1 - w : w + x1;
					}
					else if (yy > boundy)
					{
						yy = boundy;
						w = Math.abs(yy - y1) * aspect;
						xx = rw < 0 ? x1 - w : w + x1;
					}
				}
	
				// Magic %-)
				if(xx > x1) { // right side
				  if(xx - x1 < min_x) {
					xx = x1 + min_x;
				  } else if (xx - x1 > max_x) {
					xx = x1 + max_x;
				  }
				  if(yy > y1) {
					yy = y1 + (xx - x1)/aspect;
				  } else {
					yy = y1 - (xx - x1)/aspect;
				  }
				} else if (xx < x1) { // left side
				  if(x1 - xx < min_x) {
					xx = x1 - min_x
				  } else if (x1 - xx > max_x) {
					xx = x1 - max_x;
				  }
				  if(yy > y1) {
					yy = y1 + (x1 - xx)/aspect;
				  } else {
					yy = y1 - (x1 - xx)/aspect;
				  }
				}
	
				if(xx < 0) {
					x1 -= xx;
					xx = 0;
				} else  if (xx > boundx) {
					x1 -= xx - boundx;
					xx = boundx;
				}
	
				if(yy < 0) {
					y1 -= yy;
					yy = 0;
				} else  if (yy > boundy) {
					y1 -= yy - boundy;
					yy = boundy;
				}
	
				return last = makeObj(flipCoords(x1,y1,xx,yy));
			};
			/*}}}*/
			function rebound(p)/*{{{*/
			{
				if (p[0] < 0) p[0] = 0;
				if (p[1] < 0) p[1] = 0;
	
				if (p[0] > boundx) p[0] = boundx;
				if (p[1] > boundy) p[1] = boundy;
	
				return [ p[0], p[1] ];
			};
			/*}}}*/
			function flipCoords(x1,y1,x2,y2)/*{{{*/
			{
				var xa = x1, xb = x2, ya = y1, yb = y2;
				if (x2 < x1)
				{
					xa = x2;
					xb = x1;
				}
				if (y2 < y1)
				{
					ya = y2;
					yb = y1;
				}
				return [ Math.round(xa), Math.round(ya), Math.round(xb), Math.round(yb) ];
			};
			/*}}}*/
			function getRect()/*{{{*/
			{
				var xsize = x2 - x1;
				var ysize = y2 - y1;
	
				if (xlimit && (Math.abs(xsize) > xlimit))
					x2 = (xsize > 0) ? (x1 + xlimit) : (x1 - xlimit);
				if (ylimit && (Math.abs(ysize) > ylimit))
					y2 = (ysize > 0) ? (y1 + ylimit) : (y1 - ylimit);
	
				if (ymin && (Math.abs(ysize) < ymin))
					y2 = (ysize > 0) ? (y1 + ymin) : (y1 - ymin);
				if (xmin && (Math.abs(xsize) < xmin))
					x2 = (xsize > 0) ? (x1 + xmin) : (x1 - xmin);
	
				if (x1 < 0) { x2 -= x1; x1 -= x1; }
				if (y1 < 0) { y2 -= y1; y1 -= y1; }
				if (x2 < 0) { x1 -= x2; x2 -= x2; }
				if (y2 < 0) { y1 -= y2; y2 -= y2; }
				if (x2 > boundx) { var delta = x2 - boundx; x1 -= delta; x2 -= delta; }
				if (y2 > boundy) { var delta = y2 - boundy; y1 -= delta; y2 -= delta; }
				if (x1 > boundx) { var delta = x1 - boundy; y2 -= delta; y1 -= delta; }
				if (y1 > boundy) { var delta = y1 - boundy; y2 -= delta; y1 -= delta; }
	
				return makeObj(flipCoords(x1,y1,x2,y2));
			};
			/*}}}*/
			function makeObj(a)/*{{{*/
			{
				return { x: a[0], y: a[1], x2: a[2], y2: a[3],
					w: a[2] - a[0], h: a[3] - a[1] };
			};
			/*}}}*/
	
			return {
				flipCoords: flipCoords,
				setPressed: setPressed,
				setCurrent: setCurrent,
				getOffset: getOffset,
				moveOffset: moveOffset,
				getCorner: getCorner,
				getFixed: getFixed
			};
		}();
	
		/*}}}*/
		var Selection = function()/*{{{*/
		{
			var start, end, dragmode, awake, hdep = 370;
			var borders = { };
			var handle = { };
			var seehandles = false;
			var hhs = options.handleOffset;
	
			/* Insert draggable elements {{{*/
	
			// Insert border divs for outline
			if (options.drawBorders) {
				borders = {
						top: insertBorder('hline')
							.css('top',$.browser.msie?px(-1):px(0)),
						bottom: insertBorder('hline'),
						left: insertBorder('vline'),
						right: insertBorder('vline')
				};
			}
	
			// Insert handles on edges
			if (options.dragEdges) {
				handle.t = insertDragbar('n');
				handle.b = insertDragbar('s');
				handle.r = insertDragbar('e');
				handle.l = insertDragbar('w');
			}
	
			// Insert side handles
			options.sideHandles &&
				createHandles(['n','s','e','w']);
	
			// Insert corner handles
			options.cornerHandles &&
				createHandles(['sw','nw','ne','se']);
	
			/*}}}*/
			// Private Methods
			function insertBorder(type)/*{{{*/
			{
				var jq = $('<div />')
					.css({position: 'absolute', opacity: options.borderOpacity })
					.addClass(cssClass(type));
				$img_holder.append(jq);
				return jq;
			};
			/*}}}*/
			function dragDiv(ord,zi)/*{{{*/
			{
				var jq = $('<div />')
					.mousedown(createDragger(ord))
					.css({
						cursor: ord+'-resize',
						position: 'absolute',
						zIndex: zi 
					})
				;
				$hdl_holder.append(jq);
				return jq;
			};
			/*}}}*/
			function insertHandle(ord)/*{{{*/
			{
				return dragDiv(ord,hdep++)
					.css({ top: px(-hhs+1), left: px(-hhs+1), opacity: options.handleOpacity })
					.addClass(cssClass('handle'));
			};
			/*}}}*/
			function insertDragbar(ord)/*{{{*/
			{
				var s = options.handleSize,
					o = hhs,
					h = s, w = s,
					t = o, l = o;
	
				switch(ord)
				{
					case 'n': case 's': w = pct(100); break;
					case 'e': case 'w': h = pct(100); break;
				}
	
				return dragDiv(ord,hdep++).width(w).height(h)
					.css({ top: px(-t+1), left: px(-l+1)});
			};
			/*}}}*/
			function createHandles(li)/*{{{*/
			{
				for(i in li) handle[li[i]] = insertHandle(li[i]);
			};
			/*}}}*/
			function moveHandles(c)/*{{{*/
			{
				var midvert  = Math.round((c.h / 2) - hhs),
					midhoriz = Math.round((c.w / 2) - hhs),
					north = west = -hhs+1,
					east = c.w - hhs,
					south = c.h - hhs,
					x, y;
	
				'e' in handle &&
					handle.e.css({ top: px(midvert), left: px(east) }) &&
					handle.w.css({ top: px(midvert) }) &&
					handle.s.css({ top: px(south), left: px(midhoriz) }) &&
					handle.n.css({ left: px(midhoriz) });
	
				'ne' in handle &&
					handle.ne.css({ left: px(east) }) &&
					handle.se.css({ top: px(south), left: px(east) }) &&
					handle.sw.css({ top: px(south) });
	
				'b' in handle &&
					handle.b.css({ top: px(south) }) &&
					handle.r.css({ left: px(east) });
			};
			/*}}}*/
			function moveto(x,y)/*{{{*/
			{
				$img2.css({ top: px(-y), left: px(-x) });
				$sel.css({ top: px(y), left: px(x) });
			};
			/*}}}*/
			function resize(w,h)/*{{{*/
			{
				$sel.width(w).height(h);
			};
			/*}}}*/
			function refresh()/*{{{*/
			{
				var c = Coords.getFixed();
	
				Coords.setPressed([c.x,c.y]);
				Coords.setCurrent([c.x2,c.y2]);
	
				updateVisible();
			};
			/*}}}*/
	
			// Internal Methods
			function updateVisible()/*{{{*/
				{ if (awake) return update(); };
			/*}}}*/
			function update()/*{{{*/
			{
				var c = Coords.getFixed();
	
				resize(c.w,c.h);
				moveto(c.x,c.y);
	
				options.drawBorders &&
					borders['right'].css({ left: px(c.w-1) }) &&
						borders['bottom'].css({ top: px(c.h-1) });
	
				seehandles && moveHandles(c);
				awake || show();
	
				options.onChange(unscale(c));
			};
			/*}}}*/
			function show()/*{{{*/
			{
				$sel.show();
				$img.css('opacity',options.bgOpacity);
				awake = true;
			};
			/*}}}*/
			function release()/*{{{*/
			{
				disableHandles();
				$sel.hide();
				$img.css('opacity',1);
				awake = false;
			};
			/*}}}*/
			function showHandles()//{{{
			{
				if (seehandles)
				{
					moveHandles(Coords.getFixed());
					$hdl_holder.show();
				}
			};
			//}}}
			function enableHandles()/*{{{*/
			{ 
				seehandles = true;
				if (options.allowResize)
				{
					moveHandles(Coords.getFixed());
					$hdl_holder.show();
					return true;
				}
			};
			/*}}}*/
			function disableHandles()/*{{{*/
			{
				seehandles = false;
				$hdl_holder.hide();
			};
			/*}}}*/
			function animMode(v)/*{{{*/
			{
				(animating = v) ? disableHandles(): enableHandles();
			};
			/*}}}*/
			function done()/*{{{*/
			{
				animMode(false);
				refresh();
			};
			/*}}}*/
	
			var $track = newTracker().mousedown(createDragger('move'))
					.css({ cursor: 'move', position: 'absolute', zIndex: 360 })
	
			$img_holder.append($track);
			disableHandles();
	
			return {
				updateVisible: updateVisible,
				update: update,
				release: release,
				refresh: refresh,
				setCursor: function (cursor) { $track.css('cursor',cursor); },
				enableHandles: enableHandles,
				enableOnly: function() { seehandles = true; },
				showHandles: showHandles,
				disableHandles: disableHandles,
				animMode: animMode,
				done: done
			};
		}();
		/*}}}*/
		var Tracker = function()/*{{{*/
		{
			var onMove		= function() { },
				onDone		= function() { },
				trackDoc	= options.trackDocument;
	
			if (!trackDoc)
			{
				$trk
					.mousemove(trackMove)
					.mouseup(trackUp)
					.mouseout(trackUp)
				;
			}
	
			function toFront()/*{{{*/
			{
				$trk.css({zIndex:450});
				if (trackDoc)
				{
					$(document)
						.mousemove(trackMove)
						.mouseup(trackUp)
					;
				}
			}
			/*}}}*/
			function toBack()/*{{{*/
			{
				$trk.css({zIndex:290});
				if (trackDoc)
				{
					$(document)
						.unbind('mousemove',trackMove)
						.unbind('mouseup',trackUp)
					;
				}
			}
			/*}}}*/
			function trackMove(e)/*{{{*/
			{
				onMove(mouseAbs(e));
			};
			/*}}}*/
			function trackUp(e)/*{{{*/
			{
				e.preventDefault();
				e.stopPropagation();
	
				if (btndown)
				{
					btndown = false;
	
					onDone(mouseAbs(e));
					options.onSelect(unscale(Coords.getFixed()));
					toBack();
					onMove = function() { };
					onDone = function() { };
				}
	
				return false;
			};
			/*}}}*/
	
			function activateHandlers(move,done)/* {{{ */
			{
				btndown = true;
				onMove = move;
				onDone = done;
				toFront();
				return false;
			};
			/* }}} */
	
			function setCursor(t) { $trk.css('cursor',t); };
	
			$img.before($trk);
			return {
				activateHandlers: activateHandlers,
				setCursor: setCursor
			};
		}();
		/*}}}*/
		var KeyManager = function()/*{{{*/
		{
			var $keymgr = $('<input type="radio" />')
					.css({ position: 'absolute', left: '-30px' })
					.keypress(parseKey)
					.blur(onBlur),
	
				$keywrap = $('<div />')
					.css({
						position: 'absolute',
						overflow: 'hidden'
					})
					.append($keymgr)
			;
	
			function watchKeys()/*{{{*/
			{
				if (options.keySupport)
				{
					$keymgr.show();
					$keymgr.focus();
				}
			};
			/*}}}*/
			function onBlur(e)/*{{{*/
			{
				$keymgr.hide();
			};
			/*}}}*/
			function doNudge(e,x,y)/*{{{*/
			{
				if (options.allowMove) {
					Coords.moveOffset([x,y]);
					Selection.updateVisible();
				};
				e.preventDefault();
				e.stopPropagation();
			};
			/*}}}*/
			function parseKey(e)/*{{{*/
			{
				if (e.ctrlKey) return true;
				shift_down = e.shiftKey ? true : false;
				var nudge = shift_down ? 10 : 1;
				switch(e.keyCode)
				{
					case 37: doNudge(e,-nudge,0); break;
					case 39: doNudge(e,nudge,0); break;
					case 38: doNudge(e,0,-nudge); break;
					case 40: doNudge(e,0,nudge); break;
	
					case 27: Selection.release(); break;
	
					case 9: return true;
				}
	
				return nothing(e);
			};
			/*}}}*/
			
			if (options.keySupport) $keywrap.insertBefore($img);
			return {
				watchKeys: watchKeys
			};
		}();
		/*}}}*/
	
		// }}}
		// Internal Methods {{{
	
		function px(n) { return '' + parseInt(n) + 'px'; };
		function pct(n) { return '' + parseInt(n) + '%'; };
		function cssClass(cl) { return options.baseClass + '-' + cl; };
		function getPos(obj)/*{{{*/
		{
			// Updated in v0.9.4 to use built-in dimensions plugin
			var pos = $(obj).offset();
			return [ pos.left, pos.top ];
		};
		/*}}}*/
		function mouseAbs(e)/*{{{*/
		{
			return [ (e.pageX - docOffset[0]), (e.pageY - docOffset[1]) ];
		};
		/*}}}*/
		function myCursor(type)/*{{{*/
		{
			if (type != lastcurs)
			{
				Tracker.setCursor(type);
				//Handles.xsetCursor(type);
				lastcurs = type;
			}
		};
		/*}}}*/
		function startDragMode(mode,pos)/*{{{*/
		{
			docOffset = getPos($img);
			Tracker.setCursor(mode=='move'?mode:mode+'-resize');
	
			if (mode == 'move')
				return Tracker.activateHandlers(createMover(pos), doneSelect);
	
			var fc = Coords.getFixed();
			var opp = oppLockCorner(mode);
			var opc = Coords.getCorner(oppLockCorner(opp));
	
			Coords.setPressed(Coords.getCorner(opp));
			Coords.setCurrent(opc);
	
			Tracker.activateHandlers(dragmodeHandler(mode,fc),doneSelect);
		};
		/*}}}*/
		function dragmodeHandler(mode,f)/*{{{*/
		{
			return function(pos) {
				if (!options.aspectRatio) switch(mode)
				{
					case 'e': pos[1] = f.y2; break;
					case 'w': pos[1] = f.y2; break;
					case 'n': pos[0] = f.x2; break;
					case 's': pos[0] = f.x2; break;
				}
				else switch(mode)
				{
					case 'e': pos[1] = f.y+1; break;
					case 'w': pos[1] = f.y+1; break;
					case 'n': pos[0] = f.x+1; break;
					case 's': pos[0] = f.x+1; break;
				}
				Coords.setCurrent(pos);
				Selection.update();
			};
		};
		/*}}}*/
		function createMover(pos)/*{{{*/
		{
			var lloc = pos;
			KeyManager.watchKeys();
	
			return function(pos)
			{
				Coords.moveOffset([pos[0] - lloc[0], pos[1] - lloc[1]]);
				lloc = pos;
				
				Selection.update();
			};
		};
		/*}}}*/
		function oppLockCorner(ord)/*{{{*/
		{
			switch(ord)
			{
				case 'n': return 'sw';
				case 's': return 'nw';
				case 'e': return 'nw';
				case 'w': return 'ne';
				case 'ne': return 'sw';
				case 'nw': return 'se';
				case 'se': return 'nw';
				case 'sw': return 'ne';
			};
		};
		/*}}}*/
		function createDragger(ord)/*{{{*/
		{
			return function(e) {
				if (options.disabled) return false;
				if ((ord == 'move') && !options.allowMove) return false;
				btndown = true;
				startDragMode(ord,mouseAbs(e));
				e.stopPropagation();
				e.preventDefault();
				return false;
			};
		};
		/*}}}*/
		function presize($obj,w,h)/*{{{*/
		{
			var nw = $obj.width(), nh = $obj.height();
			if ((nw > w) && w > 0)
			{
				nw = w;
				nh = (w/$obj.width()) * $obj.height();
			}
			if ((nh > h) && h > 0)
			{
				nh = h;
				nw = (h/$obj.height()) * $obj.width();
			}
			xscale = $obj.width() / nw;
			yscale = $obj.height() / nh;
			$obj.width(nw).height(nh);
		};
		/*}}}*/
		function unscale(c)/*{{{*/
		{
			return {
				x: parseInt(c.x * xscale), y: parseInt(c.y * yscale), 
				x2: parseInt(c.x2 * xscale), y2: parseInt(c.y2 * yscale), 
				w: parseInt(c.w * xscale), h: parseInt(c.h * yscale)
			};
		};
		/*}}}*/
		function doneSelect(pos)/*{{{*/
		{
			var c = Coords.getFixed();
			if (c.w > options.minSelect[0] && c.h > options.minSelect[1])
			{
				Selection.enableHandles();
				Selection.done();
			}
			else
			{
				Selection.release();
			}
			Tracker.setCursor( options.allowSelect?'crosshair':'default' );
		};
		/*}}}*/
		function newSelection(e)/*{{{*/
		{
			if (options.disabled) return false;
			if (!options.allowSelect) return false;
			btndown = true;
			docOffset = getPos($img);
			Selection.disableHandles();
			myCursor('crosshair');
			var pos = mouseAbs(e);
			Coords.setPressed(pos);
			Tracker.activateHandlers(selectDrag,doneSelect);
			KeyManager.watchKeys();
			Selection.update();
	
			e.stopPropagation();
			e.preventDefault();
			return false;
		};
		/*}}}*/
		function selectDrag(pos)/*{{{*/
		{
			Coords.setCurrent(pos);
			Selection.update();
		};
		/*}}}*/
		function newTracker()
		{
			var trk = $('<div></div>').addClass(cssClass('tracker'));
			$.browser.msie && trk.css({ opacity: 0, backgroundColor: 'white' });
			return trk;
		};
	
		// }}}
		// API methods {{{
			
		function animateTo(a)/*{{{*/
		{
			var x1 = a[0] / xscale,
				y1 = a[1] / yscale,
				x2 = a[2] / xscale,
				y2 = a[3] / yscale;
	
			if (animating) return;
	
			var animto = Coords.flipCoords(x1,y1,x2,y2);
			var c = Coords.getFixed();
			var animat = initcr = [ c.x, c.y, c.x2, c.y2 ];
			var interv = options.animationDelay;
	
			var x = animat[0];
			var y = animat[1];
			var x2 = animat[2];
			var y2 = animat[3];
			var ix1 = animto[0] - initcr[0];
			var iy1 = animto[1] - initcr[1];
			var ix2 = animto[2] - initcr[2];
			var iy2 = animto[3] - initcr[3];
			var pcent = 0;
			var velocity = options.swingSpeed;
	
			Selection.animMode(true);
	
			var animator = function()
			{
				return function()
				{
					pcent += (100 - pcent) / velocity;
	
					animat[0] = x + ((pcent / 100) * ix1);
					animat[1] = y + ((pcent / 100) * iy1);
					animat[2] = x2 + ((pcent / 100) * ix2);
					animat[3] = y2 + ((pcent / 100) * iy2);
	
					if (pcent < 100) animateStart();
						else Selection.done();
	
					if (pcent >= 99.8) pcent = 100;
	
					setSelectRaw(animat);
				};
			}();
	
			function animateStart()
				{ window.setTimeout(animator,interv); };
	
			animateStart();
		};
		/*}}}*/
		function setSelect(rect)//{{{
		{
			setSelectRaw([rect[0]/xscale,rect[1]/yscale,rect[2]/xscale,rect[3]/yscale]);
		};
		//}}}
		function setSelectRaw(l) /*{{{*/
		{
			Coords.setPressed([l[0],l[1]]);
			Coords.setCurrent([l[2],l[3]]);
			Selection.update();
		};
		/*}}}*/
		function setOptions(opt)/*{{{*/
		{
			if (typeof(opt) != 'object') opt = { };
			options = $.extend(options,opt);
	
			if (typeof(options.onChange)!=='function')
				options.onChange = function() { };
	
			if (typeof(options.onSelect)!=='function')
				options.onSelect = function() { };
	
		};
		/*}}}*/
		function tellSelect()/*{{{*/
		{
			return unscale(Coords.getFixed());
		};
		/*}}}*/
		function tellScaled()/*{{{*/
		{
			return Coords.getFixed();
		};
		/*}}}*/
		function setOptionsNew(opt)/*{{{*/
		{
			setOptions(opt);
			interfaceUpdate();
		};
		/*}}}*/
		function disableCrop()//{{{
		{
			options.disabled = true;
			Selection.disableHandles();
			Selection.setCursor('default');
			Tracker.setCursor('default');
		};
		//}}}
		function enableCrop()//{{{
		{
			options.disabled = false;
			interfaceUpdate();
		};
		//}}}
		function cancelCrop()//{{{
		{
			Selection.done();
			Tracker.activateHandlers(null,null);
		};
		//}}}
		function destroy()//{{{
		{
			$div.remove();
			$origimg.show();
		};
		//}}}
	
		function interfaceUpdate(alt)//{{{
		// This method tweaks the interface based on options object.
		// Called when options are changed and at end of initialization.
		{
			options.allowResize ?
				alt?Selection.enableOnly():Selection.enableHandles():
				Selection.disableHandles();
	
			Tracker.setCursor( options.allowSelect? 'crosshair': 'default' );
			Selection.setCursor( options.allowMove? 'move': 'default' );
	
			$div.css('backgroundColor',options.bgColor);
	
			if ('setSelect' in options) {
				setSelect(opt.setSelect);
				Selection.done();
				delete(options.setSelect);
			}
	
			if ('trueSize' in options) {
				xscale = options.trueSize[0] / boundx;
				yscale = options.trueSize[1] / boundy;
			}
	
			xlimit = options.maxSize[0] || 0;
			ylimit = options.maxSize[1] || 0;
			xmin = options.minSize[0] || 0;
			ymin = options.minSize[1] || 0;
	
			if ('outerImage' in options)
			{
				$img.attr('src',options.outerImage);
				delete(options.outerImage);
			}
	
			Selection.refresh();
		};
		//}}}
	
		// }}}
	
		$hdl_holder.hide();
		interfaceUpdate(true);
		
		var api = {
			animateTo: animateTo,
			setSelect: setSelect,
			setOptions: setOptionsNew,
			tellSelect: tellSelect,
			tellScaled: tellScaled,
	
			disable: disableCrop,
			enable: enableCrop,
			cancel: cancelCrop,
	
			focus: KeyManager.watchKeys,
	
			getBounds: function() { return [ boundx * xscale, boundy * yscale ]; },
			getWidgetSize: function() { return [ boundx, boundy ]; },
	
			release: Selection.release,
			destroy: destroy
	
		};
	
		$origimg.data('Jcrop',api);
		return api;
	};
	
	$.fn.Jcrop = function(options)/*{{{*/
	{
		function attachWhenDone(from)/*{{{*/
		{
			var loadsrc = options.useImg || from.src;
			var img = new Image();
			img.onload = function() { 
				$.Jcrop(from,options); 
				$('body').trigger('jcrop:load');
			};
			img.src = loadsrc;
		};
		/*}}}*/
		if (typeof(options) !== 'object') options = { };
	
		// Iterate over each object, attach Jcrop
		this.each(function()
		{
			// If we've already attached to this object
			if ($(this).data('Jcrop'))
			{
				// The API can be requested this way (undocumented)
				if (options == 'api') return $(this).data('Jcrop');
				// Otherwise, we just reset the options...
				else $(this).data('Jcrop').setOptions(options);
			}
			// If we haven't been attached, preload and attach
			else attachWhenDone(this);
		});
	
		// Return "this" so we're chainable a la jQuery plugin-style!
		return this;
	};
	/*}}}*/
	
	})(jQuery);
	
	 
		var jst = (function(){
		
			this["JST"] = this["JST"] || {};
		
			this["JST"]["home/cutpic-page"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="jcrop_wrap">\r\n    <div class="zxx_main_con">\r\n        <div class="zxx_test_list">\r\n            <div class="rel mb20">\r\n                <img class="xuwanting" src="http://test.com/images/zd.jpg"  style="" />\r\n                <span class="preview_box crop_preview">\r\n                    <img class="img_crop_preview" src="http://test.com/images/zd.jpg" />\r\n                </span>\r\n            </div>  \r\n            <form class="crop_form">\r\n                <input type="hidden" class="x" name="x" />\r\n                <input type="hidden" class="y" name="y" />\r\n                <input type="hidden" class="w" name="w" />\r\n                <input type="hidden" class="h" name="h" />\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>';}return __p};
	
			return this["JST"];
		})();
		
		var itemView = Talent.ItemView.extend({
	
			template: jst['home/cutpic-page']
			,initialize: function() {
				this.userDesign = this.model.toJSON().originWidth;
				
			}
			,ui:{
			}
			,events:function(){
				var events = {};
				return events;
			}
			,raito:function(){
				var self = this;
				
				this.raitoNo = 1;
				var realwidth = parseInt(this.$el.find(".jcrop-holder img").css("width"));
				var realheight = parseInt(this.$el.find(".jcrop-holder img").css("height"));
				var cutwidth,cutheight;
				if(realwidth > this.userDesign){
					// 比率 this.raitoNo
					self.raitoNo = realwidth/this.userDesign;
				}
	
				// 超过500缩小
	         //    if(realwidth>this.userDesign)
	         //    {
	         //    	// boxWidth
	         //        this.cutwidth=this.userDesign;   
	         //        this.cutheight=(realheight*this.userDesign)/realwidth;   
	         //    }else{
	         //    	this.cutwidth = realwidth;
	         //    	this.cutheight = realheight;
	         //    }
	
		        // this.$el.find(".xuwanting, .jcrop-holder, .jcrop-tracker, .jcrop-holder img")
		        // .css({ "width" : this.cutwidth, "height" : this.cutheight });
				
			}
			,inputChange:function(){
				var x = parseInt(this.$el.find(".jcrop_wrap .x").val());
				var y = parseInt(this.$el.find(".jcrop_wrap .y").val());
				var w = parseInt(this.$el.find(".jcrop_wrap .w").val());
				var h = parseInt(this.$el.find(".jcrop_wrap .h").val());
				this.model.set({
					'x':x, 'y':y, 'w':w, 'h':h
				})
			}
			,onRender: function() {
			}
			,onShow: function() {
				var self = this;
				var jcrop_api;
				
				$('body').on('jcrop:load', function(){
					self.raito();
				});
				//剪切头像
				this.$el.find(".xuwanting").Jcrop({
					aspectRatio:1,
					boxWidth: self.userDesign,
					setSelect: [this.model.toJSON().x,this.model.toJSON().y,this.model.toJSON().w,this.model.toJSON().h],
					onChange:showCoords,
					onSelect:showCoords
				},function(){
					// jcrop_api=this;
					// jcrop_api.animateTo([100,100,400,300]);
				});	
	
				//简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
				function showCoords(obj){
					 
					self.$el.find(".x").val(obj.x);
					self.$el.find(".y").val(obj.y);
					self.$el.find(".w").val(obj.w);
					self.$el.find(".h").val(obj.h);
	
					self.inputChange();
					if(parseInt(obj.w) > 0){
						//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
						var rx = self.$el.find(".preview_box").width() / obj.w; 
						var ry = self.$el.find(".preview_box").height() / obj.h;
						//通过比例值控制图片的样式与显示
						self.$el.find(".img_crop_preview").css({
							width:Math.round(rx * self.$el.find(".xuwanting").width()) + "px",	//预览图片宽度为计算比例值与原图片宽度的乘积
							height:Math.round(rx * self.$el.find(".xuwanting").height()) + "px",	//预览图片高度为计算比例值与原图片高度的乘积
							marginLeft:"-" + Math.round(rx * obj.x) + "px",
							marginTop:"-" + Math.round(ry * obj.y) + "px"
						});
					}
				}
	
				if(!(this.model.toJSON().previewBox)){
					this.$el.find('.jcrop_wrap .crop_preview').hide();
				}
			}
			,onClose:function(){
			}
		});
	 
	

	return itemView;
})