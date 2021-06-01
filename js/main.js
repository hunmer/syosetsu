String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

var g_selectMenuTimer;
var g_detail;
var g_s_selectText;
var g_type;
$(function() {
    
    var h = $('#_selectMenu').height();
    window.addEventListener('scroll', function(e) {
        var totalH = document.body.scrollHeight || document.documentElement.scrollHeight
        var clientH = window.innerHeight || document.documentElement.clientHeight
        var validH = totalH - clientH
        var scrollH = document.body.scrollTop || document.documentElement.scrollTop
        var result = (scrollH / validH * 100).toFixed(2)
        $('.progress-bar').css('width', result + '%');
    });
    
    $(document)
    	.on('mousemove', function(event) {
    		g_x = event.clientX;
    		g_y = event.clientY;
    	})
        .on('touchumove', function(event) {
    		g_x = event.clientX;
    		g_y = event.clientY;
    	}).on('mousedown', '#_viewer_content', function(event) {
    		onClick(event);
        })
        .on('ontouchdown', '#_viewer_content', function(event) {
    		onClick(event);
        })
        .on('selectionchange', function(event) {
            return;
        	if(g_selectMenuTimer){
        		clearTimeout(g_selectMenuTimer);
        		g_selectMenuTimer = undefined;
        	}
            g_selectMenuTimer = setTimeout(() => {
            	var text = getSelectHtml();
            	g_s_selectText = text;
	            if (text.length > 0) {
	                text = text.replaceAll('</br>', "\n").replaceAll('<p>', '').replaceAll('</p>', "\n");
	                
	                g_speaker.speak(text);

	                 var w = $('#_actionBar').width();
	                var x = g_x + w / 2;
	                if (x + w > $(window).width()) {
	                    x = $(window).width() - w - 10;
	                }
	                var y = g_y + 10;
	                if (y + h > window.screen.availHeight - 100) {
	                    y = window.screen.availHeight - h - 10 - 130;
	                }
	                $('#_actionBar').css({
	                    left: x + 'px',
	                    top: y + 'px',
	                    display: 'block',
	                });
	                return;


	                var w = $('#_selectMenu').width();
	                var x = g_x + 10;
	                if (x + w > $(window).width()) {
	                    x = $(window).width() - w - 10;
	                }
	                var y = g_y + 30;
	                if (y + h > window.screen.availHeight - 100) {
	                    y = window.screen.availHeight - h - 10 - 130;
	                }
	                $('#_selectMenu').css({
	                    left: x + 'px',
	                    top: y + 'px',
	                    display: 'block',
	                }).find('.tab-pane textarea').each((i, d) => {
	                    d.value = text;
	                });
	                //.find('.tab-pane').css('width', $(window).width() - event.clientX - 100 + 'px');
	            }}, 200);
        })
        .on('click', '[data-action]', function(event) {
            switch ($(this).attr('data-action')) {
            	case 'mark':
            		g_s_selectNodes.forEach((d) => {
            			console.log(d);
            			$(d).toggleClass('bz');
            		})
            		break;

            	case 'typeing':
            		$('[data-action=typeing]').toggleClass('enable');
            		if(!$('[data-action=typeing]').hasClass('enable')){
            			clearInterval(g_speaker.timer);
            		}else{
            			g_speaker.timer = setInterval(() => {
            			var textarea = $('#typing textarea')[0];
                        textarea.scrollTop = textarea.scrollHeight - 200;
            		}, 200);
            		}
            		break;
                case 'darkMode':
                    $('body').toggleClass('bg-dark text-light');
                    break;
            	case 'playAudio':
	                g_speaker.speak(g_s_selectText);
            		break;
                case 'switchRoman':
                    $('.rt').toggle();
                    break;
                case 'listen':
                    	 g_speaker.speak(g_detail['content']);
                    //}
                    break;

                case 'setDango':
                	g_dom_kana.find('.rt').html($(this).html());
                	$('.toast').toast('hide');
                	break;

                case 'dango':
                	var h = '';
                	var kana;
                	g_dom_kana = $(this);
                	for(let roman of $(this).attr('data-value').split('/')){
                		kana = wanakana.toKana(roman);
                		h += '<span style="margin-left: 10px;" class="badge bg-secondary" data-action="setDango">'+kana+'</span>';
                	}
                	var w = $('.toast .toast-body').html(h).width();
                	var x = g_x;
                	if(x + w > $(window).width()){
                		x = $(window).width() - w;
                	}
                	$('.toast').css({
                		left: x + 'px',
                		top: g_y + 'px',
                		position: 'fixed',
                        display: 'unset'
                	}).toast('show');
                	break;

                default:
                    // statements_def
                    break;
            }
        });

    $('.tab-pane').css('minHeight', h);
    if(_GET['url']){
        if(_GET['cap']){
            loadCaption(_GET['url']);
        }else{
            loadBook(_GET['url']);
        }
    }else{
        loadBook('https://ncode.syosetu.com/n2049gt/');
    }
        //loadCaption('https://ncode.syosetu.com/n1386gb/4/');
     //$('[data-action=typeing]').click();
    //showHomePage();
});

function showHomePage(){
    showUI('_home');
    $('#loading').hide();
}

function onClick(event){
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    if(event.screenX >= cx - 300 && event.screenX <= cx + 300 && event.screenY >= cy - 300 && event.screenY <= cy + 300){
        if(!$('.toast').hasClass('hide')){
                $('.toast').hide()
            }
            if ($('#_actionBar').css('display') != 'none') {
                $('#_actionBar').css('display', 'none');
            }
            if ($('#_selectMenu').css('display') != 'none') {
                $('#_selectMenu').css('display', 'none');
            } else {
                $('#_viewer_bottom').toggleClass('hide');
            }
    }
}

var g_dom_kana;
var g_s_selectNodes = [];
function getSelectHtml() {
	var text = '', span;
    if (window.getSelection && window.getSelection().baseNode) {
    	var start = $(window.getSelection().baseNode.parentElement);
    	var end = $(window.getSelection().extentNode.parentElement);

		var i_start = parseInt(start.attr('data-id'));
		var i_end = parseInt(end.attr('data-id'));
		var doms = [];
		for(let i=i_start;i<=i_end;i++){
			span = $('[data-id='+i+']');
			doms.push(span);
			text += span.html();
		}
		g_s_selectNodes = doms;
    }
    return text;
}

function loadBook(url) {
    $('#loading').show();
    $.getJSON(g_s_api+'api?type=list&param=' + url, function(json, textStatus) {
        if (textStatus == 'success') {
            var ml = json['list'].length;
				// <img class="col-4" src="img/book.jpg">
            var h = `
				<div id='_book_detail' class="col-8 text-center" style="line-height: 2rem;display: block;width: 100%;font-size: 20px;padding: 20px;">
					<span id='_book_title'>` + json['title'] + `</span></br>
					<span id='_book_author'>作者: <a href="` + json['author']['homePage'] + '" target="_blank">' + json['author']['name'] + `</a></span></br>
					<span id='_book_caps'>总章数: ` + ml + `</span></br>
					<span id='_book_lastUpdate'>最后更新于: ` + json['list'][ml - 1].time + `</span></br>
					<span id='_book_tags'>标签: <span class="badge rounded-pill bg-primary">R15</span><span class="badge rounded-pill bg-primary">少女</span>
					<span class="badge rounded-pill bg-secondary">+</span>
				    </span></br>
                    <div style="width: 100%;text-align: right; padding: 20px;">
                        <button type="button" class="btn btn-primary" onclick="$('.list-group-item.active')[0].click();">続きから読んる</button>
                    </div>
				</div>
			</div>
			<ul class="list-group pt-2" style="margin-left: 5px">
			`;

            for (let caps of json['list']) {
                h += `
				  <a href="javascript: loadCaption('` + caps['url'] + `')" class="list-group-item list-group-item-action`+(g_config.lastRead == caps['url'] ? ' active' : '')+`" aria-current="true">
				    <span>` + caps['title'] + `</span>
							  	<small>` + caps['time'] + `</small>
				  </a>`;
            }

            $('#_book .row').html(h + '</ul>');
            $('#loading').hide();
            showUI('_book');
        }
    });
}

var g_timer = {
    id: 0,
    start: 0,
    sec: 0,
};

function loadCaption(url) {
    $('#loading').show();
    history.pushState({}, '', 'index.html?url='+url+'&cap=1')
    $.getJSON(g_s_api+'api?type=content&param=' + url, function(json, textStatus) {
    	g_config.lastRead = url;
    	local_saveJson('config', g_config);

    	g_detail = json;
        if (textStatus == 'success') {
            $('#_viewer_tree').html(`
				<nav aria-label="breadcrumb">
			  <ol class="breadcrumb">
			    <li class="breadcrumb-item"><a href="javascript: showHomePage()">Home</a></li>
			    <li class="breadcrumb-item"><a href="javascript: loadBook('`+json['homePage']+`')">` + json['novel'] + `</a></li>
			    <li class="breadcrumb-item active" aria-current="page">` + json['title'] + `</li>
			  </ol>
			</nav>
			`);
            $('#_viewer_title').html(json['title']);
            $('#_viewer_author').html(`<a href="` + json['author']['homePage'] + '" target="_blank">' + json['author']['name'] + `</a>`);
            $('#_viewer_cpas').html(json['list']);
            $('#_viewer_length').html(json['content'].length + '字');

            var content = '';
			json['content'].split('').forEach((d, i) => {
				// if(d != ' '){
			    	content += '<span data-id='+i+'>' + d + '</span>';
				// }
			});
            $('#_viewer_content').html(content.replaceAll('\n', '<br>'))

   			 window.scrollTo(0, 0);

            parseJapaese(json['content']);

            $('#_viewer_action').html(`
        		<div id="_viewer_actions" class="w-100 text-center">
					<hr>
					<button type="button" ` + (json['prev'] ? `onclick="loadCaption('` + json['prev'] + `')" ` : 'disabled ') + `class="btn btn-secondary btn-lg"><-</button>
					<button type="button" data-action="time" class="btn btn-secondary btn-lg">00:00</button>
					<button type="button" ` + (json['next'] ? `onclick="loadCaption('` + json['next'] + `')" ` : 'disabled ') + `class="btn btn-secondary btn-lg">-></button>
				</div>
        		`);
            clearTimer();
            g_timer.id = setInterval(() => {
                g_timer.sec++;
                $('[data-action=time]').html(getTime(g_timer.sec));
            }, 1000);
             $('#loading').hide();
            showUI('_viewer');
        }
    });
}


function parseJapaese(content) {
	//var match = content.match(/[\u4e00-\u9fa5]/g).join('');
	return;
	var con = $('#_viewer_content');
    $.post(g_s_api+'api/japanese.php', { q: content }, function(data, textStatus, xhr) {
        if (textStatus == 'success') {
            json = JSON.parse(data);
            var i = 0;
            var b;
            for (let d of json) {
                if (d.length > 1 && d[0].match(/[\u4e00-\u9fa5]/) !== null) {
					var arr = d[0].split('');
					var start = con.find('span:contains("'+arr[0]+'"):not(.s)');
					var i_start =parseInt(start.attr('data-id'));
					if(!isNaN(i_start)){
						var i_end = i_start+arr.length - 1;
						console.log(i_start, i_end);

						b = d[1].indexOf('/') == -1;
						var l = $('<span class="ruby" '+(!b ? ' data-action="dango" data-value="'+d[1]+'"' : '')+'><span class="rb"></span><span class="rt">'+(b ? wanakana.toKana(d[1]) : '')+'</span></span>');
						l.insertBefore(start);
						for(let i=i_start;i<=i_end;i++){
						     con.find('[data-id='+i+']').addClass('s').insertBefore(l.find('.rb'));
						}
					}
                }
            }
        }
    });
}

function clearTimer() {
    if (g_timer.id) {
        clearInterval(g_timer.id);
        g_timer.id = undefined;
    }
}

function showUI(id) {
    $('.container').each(function(index, el) {
        if (el.id == id) {
            $(el).removeClass('hide');
        } else {
            $(el).addClass('hide');
        }
    });
    window.scrollTo(0, 0);
}

function hideUI(id) {
    $('.container').each(function(index, el) {
        if (el.id == id) {
            $(el).addClass('hide');
        } else {
            $(el).removeClass('hide');
        }
    });
}

var g_speaker = {
    synth: window.speechSynthesis,
    index: 0,
    voice: undefined,
    text: '',
    last: 0,
    utterThis: 0,
    init: () => {
    	$('#range_rate').val(g_config.rate);
	 	$('#range_patch').val(g_config.patch);
        speechSynthesis.onvoiceschanged = () => {
            voices = g_speaker.synth.getVoices();
            for (i = 0; i < voices.length; i++) {
                if (voices[i].lang == 'ja-JP') {
                    g_speaker.voice = voices[i];
                    g_speaker.utterThis = new SpeechSynthesisUtterance();
                    g_speaker.utterThis.onend = function(event) {}
                    g_speaker.utterThis.onerror = function(event) {}
                    g_speaker.utterThis.onboundary = function(event) {

                        var text = event.target.text.substr(event.charIndex, event.charLength);

                        if($('[data-action=typeing]').hasClass('enable')){
                        	if(!g_type){
		            			showUI('typing');
		            		}
                            $('#typing textarea').val($('#typing textarea').val() + (event.elapsedTime - g_speaker.lastSpeak >= 1000 ? "\n" : '') + text);
                        // $('#typing textarea').typetype((event.elapsedTime - g_speaker.lastSpeak >= 1000 ? "\n" : '') + text,
                        // 	 {
                        //         e: 0, // error rate. (use e=0 for perfect typing)
                        //         t: 50, // interval between keypresses
                        //       });

                        }

                        g_speaker.lastSpeak = event.elapsedTime;

                    	return;
                        $('.mark').removeClass('mark');

                        var full = $('#_viewer_content').html();
                        var last = full.indexOf(text, g_speaker.last);
                        if (last != -1) {
                            var t = '<span class="mark">' + text + '</span>'
                            $('#_viewer_content').html(full.substr(0, g_speaker.last) + full.substr(g_speaker.last - full.length).replace(text, t));
                        }
                        g_speaker.last = last;
                    }
                    g_speaker.utterThis.voice = g_speaker.voice;
                    // g_speaker.utterThis.pitch = g_config.patch;
                    // g_speaker.utterThis.rate = g_config.rate;
                    g_speaker.utterThis.volume = 1;
                    return true;
                }
            }
            return false;
        };
    },

    setPatch: (value) => {
    	g_config.patch = value;
    	local_saveJson('config', g_config);
    },

    setRate: (value) => {
    	g_config.rate = value;
    	local_saveJson('config', g_config);
    },

    speak: (text) => {
        if (g_speaker.synth.speaking) {
            g_speaker.synth.cancel()
        }
        g_speaker.text = text;
         g_speaker.last = 0;
        g_speaker.utterThis.text = text;
        g_speaker.synth.speak(g_speaker.utterThis);
    }
}
g_speaker.init();