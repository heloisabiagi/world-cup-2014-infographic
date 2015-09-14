/**
 * PLUGINS
 *
 */

/* Navegação via scroll */
$.fn.scroll_nav = function() {
	
   return this.each(function(){
	  $(this).on('click', function(e) {
		  	e.stopImmediatePropagation();
			el = e.target;
			
			var curr_scene = $(this).closest('.scene').attr('data-scene');					
			var next_scene = parseInt(curr_scene) + 1;
			var shape = $(this).attr('data-shape');
			var next_el = $('.scene' + next_scene);
			var grupo = $(this).attr('data-grupo');

			switch(shape) {
				// comportamento para as bolinhas que ativam os grupos
				case 'circle':
				case 'text':																		
					obj0['scene2'].start_scene(grupo);
					obj0['scene3'].start_scene(grupo);
					
					if(curr_scene == 1) {
						$("html, body").animate({ scrollTop: $(next_el).offset().top }, 500);
					}
					
					$('#grupos-mapa').attr('data-ativo', grupo);
					if(typeof _gaq != 'undefined') {
						contexto = $('.scene' + curr_scene).attr('id');
						_gaq.push(['_trackEvent','Infográfico Copa 2014','grupo-' +grupo, contexto]);
						}
					
				break;
				
				// comportamento especial para os shapes dos países: só navega se o país estiver no grupo ativo
				case 'country':	
					if(grupo == $('#grupos-mapa').attr('data-ativo')) {
						pais = $(this).attr('data-pais');					
						obj0['scene2'].start_scene(grupo);
						obj0['scene3'].start_scene(grupo, pais);
						$("html, body").animate({ scrollTop: $('.scene3').offset().top }, 500);
						
						if(typeof _gaq != 'undefined') {
							contexto = $('.scene' + curr_scene).attr('id');
							_gaq.push(['_trackEvent','Infográfico Copa','pais-' +pais, contexto]);
						}
							
					} else {
						return false;
						}
				break;
				
				// comportamento para demais shapes que também ativam países
				case 'rect':
				case 'arc':
				case 'flag':								
					pais = $(this).attr('data-pais');					
					obj0['scene2'].start_scene(grupo);
					obj0['scene3'].start_scene(grupo, pais);
					$("html, body").animate({ scrollTop: $('.scene3').offset().top }, 500);	
					
					if(typeof _gaq != 'undefined') {
							contexto = $('.scene' + curr_scene).attr('id');
							_gaq.push(['_trackEvent','Infográfico Copa 2014','pais-' +pais, contexto]);
						}
					
										
				break;
				
				// comportamento para navegação global
				case 'nav':
					var go_to = $(this).attr('data-scene');
					$("html, body").animate({ scrollTop: $('.scene' + go_to).offset().top }, 500);
					
					if(typeof _gaq != 'undefined') {
							contexto = $('.scene' + curr_scene).attr('id');
							_gaq.push(['_trackEvent','Infográfico Copa 2014','navegacao-global', contexto]);
						}
					
				break;
				
			}
			// return false;
		});
   });
};

// SVG
$.fn.svg = function(options) {

	 params = jQuery.extend({path: '', width : '100%', height : '100%', x: '0', y: '0', vwidth: '100%', vheight: '100%'}, options);
	 
	 return this.each(function(){
		var el_id = $(this).attr('id');
		var __path = Raphael(el_id, params.width, params.height);
		if(options.vwidth) {
		__path.setViewBox(params.x, params.y, params.vwidth ,params.vheight, true);
		} else {
		__path.setViewBox(params.x, params.y, params.width, params.height, true);	
			}
		__path.add(params.path);					   
	});
};

/**
 * MAIN FUNCTIONS
 *
 */
copa2014.selecoes = (function(){

	return {
		init: function(){
			obj0 = this;		
			var data = obj0.get_data();
			if(!data) {
				obj0.store_data();	
			} else {
				obj0['scene1'].start_scene();
				obj0['scene2'].start_scene();
				obj0['scene3'].start_scene();
				}
			},
		main_data: '',	
		colors: {
			'0': '#107d84',
			'1': '#e2b900',
			'2': '#de4331',
			'3': '#05476d'
			},			
		store_data: function(){			
				$.ajax({
					  dataType: "json",
					  url: "js/selecoes2014.json",
					  success: function(data){
						 obj0.main_data = data;
						 obj0['scene1'].start_scene();
						 obj0['scene2'].start_scene();
						 obj0['scene3'].start_scene();
						},
					  error: function(){
						  alert('Não foi possível carregar o infográfico');
						  }
					  });	
			},
		get_data: function(){
			return obj0.main_data;
			},
		navegacao_grupos: function(){
			$('[data-shape], .main-nav li').scroll_nav();
			},				
		scene1: {							
			start_scene: function(){
				var data = obj0.get_data();
				if(!data) { return false; }
				
				valor_total = accounting.formatNumber(data.total_real, 0, ".", ",");
				$('h2 .valor-total').text(valor_total);	
							
				var __grafico = Raphael("grafico-valor-mercado", "670", "100%");
				
					var altura_grafico = $('#grafico-valor-mercado').height();
					var h = 300; // área a ser ocupada pela coluna maior
					var s1i1 = 0; // iterador: scene + cena + i + ordem em que aparece
					var s1i2 = -1;
					
					//Recupera os valores
					var total_heights = {};
					var total = [];
					
					$.each(data['grupos'], function(grupo, atributos){
						total_val = parseInt(atributos['total_euro']);
						total.push(total_val);
						total_heights[atributos['nome']] = [];
						
						selecoes = atributos['selecoes'];
							$.each(selecoes, function(pais, valor) {
								valor = parseInt(valor['valor_euro']);
								total_heights[atributos['nome']].push(valor);
								});
						});
					
					
					// Valor do maior grupo para determinar a altura	
					var max_h = parseFloat(total.sort(function(a,b){return b-a;}));
					
					// Cria a escala
					var scale = function(num) {
						return parseInt((h * num)/max_h);
						}
					
					// Cria as shapes de cada grupo	
					var __group = {};
					$.each(data['grupos'],function(grupo, atributos) {
						function initAnimation(){						
							s1i1++;
							__group[atributos['nome']] = __grafico.set();	
							
							// __ballgroup é o círculo de cada grupo						
							var ballgroup_r = 25;
							var ballgroup_d = ballgroup_r * 2;
							var d = 30;
							var ballgroup_x = (ballgroup_d * s1i1) + (d * s1i1);
							var ballgroup_y = (altura_grafico - ballgroup_d) + -20;
							
							var __ballgroup = __grafico.circle(ballgroup_x, ballgroup_y, 0).attr({fill:'#2e323d', stroke: '#FFF', 'stroke-width': '3'});
							__ballgroup.node.id = 'grupo-' + s1i1;
							__ballgroup.node.setAttribute('data-grupo', atributos['nome']);
							__ballgroup.node.setAttribute('data-shape', 'circle');
							__ballgroup.node.setAttribute('data-fill', 'cor5');
							__ballgroup.node.setAttribute('data-behaviour', 'click-grupo');
							__ballgroup.node.setAttribute('data-tooltip', 'tooltip-grupo');
							
							var __group_name = __grafico.text(ballgroup_x, ballgroup_y, grupo).attr({fill: '#FFF', 'font-size': '15px'});
							__group_name.node.setAttribute('data-shape', 'text');
							__group_name.node.setAttribute('data-behaviour', 'click-grupo');
							__group_name.node.setAttribute('data-tooltip', 'tooltip-grupo');
							__group_name.node.setAttribute('data-grupo', atributos['nome']);
							
							$('#grupos-grafico .loader').remove();	
										
							__ballgroup.animate({r: ballgroup_r}, 500, "easeIn", function(){
							
							var data_heights = total_heights[atributos['nome']];
							var rect_w = 20;
							var ref_ball = document.getElementById('grupo-' + s1i1);
							var bar_y = altura_grafico - __ballgroup.getBBox().y;							
							s1i2++;								
							s1i3 = s1i2+1;
							
							var anima_x = ((s1i3 * (ballgroup_d + d)) - (rect_w/2))-2;
							var anima_y = (((altura_grafico - h) - bar_y ));
							var anima_w = rect_w + 2;
							var anima_h = h;
							
							var __bar_anima  = __grafico.rect(anima_x, anima_y, anima_w, anima_h).
							attr({
								'stroke-width': '0',
								'fill': '#FFF'
								});
							
							var anim = Raphael.animation({height: '0'}, 1200, "easeIn");
							
							// __bars são as barras do gráfico
							var s1i4=0;
							var selecoes = atributos['selecoes'];
							var arr_grupo = [];
							var __barO = {};

							$.each(selecoes, function(pais, valor){
							s1i4++;
							arr_grupo.push(pais);
							__barO[pais] = '';							
							
							switch(s1i4) {
							case 1:	
							
							__barO[pais]  = __grafico.rect((s1i3 * (ballgroup_d + d)) - (rect_w/2), (((altura_grafico) - scale(data_heights[0])) - bar_y), rect_w, scale(data_heights[0]) + 5).attr({
								'stroke-width': '0',
								'fill': obj0.colors[0]
								});
							
							__barO[pais].node.setAttribute('data-grupo', atributos['nome']);
							__barO[pais].node.setAttribute('data-pais', pais);
							__barO[pais].node.setAttribute('data-shape', 'rect');
							__barO[pais].node.setAttribute('data-fill', 'cor1');
							__barO[pais].node.setAttribute('data-tooltip', 'tooltip-pais');
							__barO[pais].toBack();
							break;
							
							case 2:
							case 3:
							case 4:
																						
							__barO[pais] = __grafico.rect((s1i3 * (ballgroup_d + d)) -(rect_w/2), (__barO[arr_grupo[arr_grupo.length -2]].getBBox().y - scale(data_heights[s1i4 -1])), rect_w, scale(data_heights[s1i4 -1])).
							attr({
								'stroke-width': '0',
								'fill': obj0.colors[s1i4 -1]
								});
							
							__barO[pais].node.setAttribute('data-grupo', atributos['nome']);
							__barO[pais].node.setAttribute('data-pais', pais);
							__barO[pais].node.setAttribute('data-shape', 'rect');
							__barO[pais].node.setAttribute('data-fill', 'cor' + s1i4);
							__barO[pais].node.setAttribute('data-tooltip', 'tooltip-pais');
							__barO[pais].toBack();		
							break;
							
							} // switch
							
							__bar_anima.animate(anim.delay(100*s1i2));	
							
							$('#grupos-grafico .hidden-item').animate({opacity:1}, 500);
							obj0.scene1.tooltip_pais();
							obj0.scene1.tooltip_grupo();
							obj0.navegacao_grupos();
							
								
										});// each bars
								
								});	// animateBall												
							
						};
						
					setTimeout(initAnimation, 800);
													
				}); // each grupo
									
													  
				}, 
			tooltip_pais: function(){
				var data = obj0.get_data();
				if(!data) { return false;}
				
				var rect_el = $('[data-tooltip=tooltip-pais]');				
				rect_el.on('mouseover',function(e){						
						e.stopImmediatePropagation();
						
						var get_pais = $(this).attr('data-pais');
						var get_grupo = $(this).attr('data-grupo');
						var nome_pais = data['grupos'][get_grupo]['selecoes'][get_pais]['nome'];
						
						var last_space = nome_pais.lastIndexOf(' ');
						if (last_space != -1) {
							nome_pais = '<span class="name-breaker">' + nome_pais.substr(0, last_space) + '</span><span class="name-breaker">' + nome_pais.substr(last_space) + '</span>';
						}
						
						var valor = data['grupos'][get_grupo]['selecoes'][get_pais]['valor_real']; 
						var format_valor = accounting.formatNumber(valor, 1, ".", ",");
						if(valor > 1000) {
							format_valor = accounting.formatNumber(Math.round(valor), 1, ".", ",").replace(/\,0$/, '');
							}
						var parent_offset = $('#grafico-valor-mercado').offset();
						
						var tooltip =  '<div class="tooltip1">';
						tooltip += '<div class="tip-header flag-header"><div class="small-flag" id="flag-'+ get_pais + '"></div>';
						tooltip += '<small>' + nome_pais + '</small>';
						tooltip += '</div>';
						tooltip += '<div class="tip-body"><big>' + format_valor + '</big></div>';
						tooltip += '<div class="tip-footer"><small>R$ em milhões</small></div>';
						tooltip += '</div>';
						
						$('#grafico-valor-mercado').prepend(tooltip);
						
						var bandeira = copa2014.flags[get_pais];
						
						$('#flag-' + get_pais).svg({ path: bandeira, width: '30', height: '20', vx: '0', vy: '0', vwidth: '60', vheight: '40' });
												
						$('.tooltip1').each(function(){
							$(this).animate({opacity: 1}, 200);
							var tooltip_height = $(this).height();
							$(this).css({left: ((e.pageX - parent_offset.left) - $(this).width()) - 20, top: (e.pageY - parent_offset.top) - (tooltip_height/2 +2)}).addClass('lt');
						});
				});
				
				rect_el.on('mouseout',function(){
					$('.tooltip1').each(function(){
						$(this).animate({opacity: 0}, 200, function(){
							$(this).remove();
							});
						});
					});
					
				},
			tooltip_grupo: function(){
				var data = obj0.get_data();
				if(!data) { return false;}
				
				var circle_el = $('[data-tooltip=tooltip-grupo]');
					
				circle_el.on('mouseover',function(e){
					e.stopImmediatePropagation();
					
					get_grupo = $(this).attr('data-grupo');	
									
					var valor_grupo = data['grupos'][get_grupo]['total_real'];
					var grupo_offset = $(this).offset();
					var parent_offset = $('#grafico-valor-mercado').offset();
					
					var grupo_left = grupo_offset.left - parent_offset.left;
					var grupo_top =  grupo_offset.top - parent_offset.top;
					var format_valor_grupo = accounting.formatNumber(valor_grupo, 1, ".", ",");
					
					if(valor_grupo > 1000) {
						format_valor_grupo = accounting.formatNumber(Math.round(valor_grupo), 1, ".", ",");
						}
					
					var tooltip_grupo = '<div class="tooltip1 tooltip-' + get_grupo +'">';
					tooltip_grupo += '<div class="tip-header"><small>soma do GRUPO</small></div>';
					tooltip_grupo += '<div class="tip-body"><big>' + format_valor_grupo.replace(/\,0$/, '') + '</big></div>';
					tooltip_grupo += '<div class="tip-footer"><small>R$ em milhões</small></div>';
					tooltip_grupo += '</div>';
					
					$('#grafico-valor-mercado').prepend(tooltip_grupo);
					
					var tooltip_grupo_width = $('.tooltip-' + get_grupo).width();
					var tooltip_grupo_height = $('.tooltip-' + get_grupo).height();
					$('.tooltip-' + get_grupo).css({left: grupo_left -(tooltip_grupo_width +20), top:  grupo_top - 25}).addClass('lt');
					
					s1i1 =-1;
					
					group_rects = $('[data-shape=rect][data-grupo="' + get_grupo + '"]','#grafico-valor-mercado');
										
					group_rects.each(function(){
						s1i1++;
						var get_pais = $(this).attr('data-pais');
						var get_grupo = $(this).attr('data-grupo');
						var nome_pais = data['grupos'][get_grupo]['selecoes'][get_pais]['nome'];						
						var last_space = nome_pais.lastIndexOf(' ');
						
						if (last_space != -1) {						
							nome_pais = '<span class="name-breaker">' + nome_pais.substr(0, last_space) + '</span><span class="name-breaker">' + nome_pais.substr(last_space) + '</span>';
						}
						
						class_list = $(this).attr('class');
						$(this).attr('class', class_list + ' active');
						
						var el_offset = $(this).offset();
						var parent_offset = $('#grafico-valor-mercado').offset();
						var el_left = el_offset.left -parent_offset.left;
						var el_top = el_offset.top - parent_offset.top;
						var el_width = $(this).attr('width');
						var el_height = $(this).attr('height');
						
						tooltip_pais =  '<div class="tooltip1 tooltip-' + get_pais +'">';
						tooltip_pais += '<div class="tip-header flag-header"><div class="small-flag" id="flag-'+ get_pais + '"></div>';
						if (last_space != -1) {	
						tooltip_pais += '<small class="multi-line">' + nome_pais + '</small>';
						} else {
							tooltip_pais += '<small>' + nome_pais + '</small>';
							}
						tooltip_pais += '</div>';	
						tooltip_pais += '</div>';
						
						$('#grafico-valor-mercado').prepend(tooltip_pais);						
						
						var bandeira = copa2014.flags[get_pais];
						
						$('#flag-' + get_pais).svg({ path: bandeira, width: '30', height: '20', vx: '0', vy: '0', vwidth: '60', vheight: '40' });
						
						var tooltip_pais_width = $('.tooltip-' + get_pais).width();
						var tooltip_pais_height = $('.tooltip-' + get_pais).height();
						
						if(s1i1 == 0 && s1i1%2 == 0) {
						$('.tooltip-' + get_pais).css({left: el_left + 30, top:  el_top - tooltip_pais_height}).addClass('rt');
						} else if(s1i1 != 0 && s1i1%2 == 0) { 
						$('.tooltip-' + get_pais).css({left: el_left + 30, top:  el_top}).addClass('rt');
						} else{
						$('.tooltip-' + get_pais).css({left: el_left - (tooltip_pais_width + 20), top:  el_top}).addClass('lt');
							}
					}); //each
					$('.tooltip1').animate({opacity: 1}, 200);
				}); // mouseover
				
				
				circle_el.on('mouseout',function(){					
					grupo = $(this).attr('data-grupo');
					$('.tooltip1').each(function(){
						$(this).animate({opacity: 0}, 200, function(){
							$(this).remove();
							});
						});
					
					group_rects = $('[data-shape=rect][data-grupo="' + get_grupo + '"]','#grafico-valor-mercado');
					
					group_rects.each(function(){
						empty_list = $(this).attr('class').replace('active', '');
						$(this).attr('class', empty_list);
						});	
						
					});
					
					
					
				
				}							
		}, // scene1
		scene2: {
			start_scene: function(grupo){
				var grupo = grupo? grupo: "A";
				var data = obj0.get_data();
					if(!data) { return false;}
					var data_grupo = data['grupos'][grupo];	
					
					// limpa cena anterior
					obj0.scene2.clear_scene();
					$('#grupos-mapa').attr('data-ativo', grupo);
					$('.grupo-nome').text(grupo);
						
						// monta menu com as bandeiras												
						for(s2i7=0; s2i7 < $('.paises-grupos').length; s2i7++) {
							s2i1=-1;
							$.each(data_grupo['selecoes'], function(nome, atributos){
									s2i1++;
									var get_pais = nome;
									var nome = data_grupo['selecoes'][nome]['nome'];
									
									var bandeira = copa2014.flags[get_pais];
									var lista_paises_grupo = '';
									lista_paises_grupo += '<li data-pais="'+get_pais+'" data-grupo="'+grupo+'">';
									lista_paises_grupo += '<div class="svg-pais" data-pais="'+get_pais+'" data-grupo="'+grupo+'" data-behaviour="hover-pais" id="svg-pais-'+get_pais+'-'+s2i7+'" data-shape="flag"></div>';
									lista_paises_grupo += '<span class="grupo-nome">'+nome+'</span>';
									lista_paises_grupo += '</li>';								
									$('.paises-grupos').eq(s2i7).append(lista_paises_grupo);
									
									$('#svg-pais-'+get_pais + '-' + s2i7).svg({ path: bandeira, width: '38', height: '25', vx: '0', vy: '0', vwidth: '60', vheight: '40' });
									
									
									$('path[data-pais="'+get_pais+'"]', '#grupos-mapa').attr({'data-fill': 'cor'+ (s2i1+1)});
										
			
									var pais_ie8 = copa2014.mundo[get_pais];
									for(s2i2=0; s2i2 < pais_ie8.length; s2i2++) {
										pais_ie8[s2i2].attr({'fill': obj0.colors[s2i1]});
										}
									
																			
								});
							
						} // end for
							
							s2i4 = 0;							
							$('.paises-grupos li').each(function(){
								s2i4++;
								$(this).animate({left: '0'}, 200 * s2i4);
								});
							
							$('#grupos-mapa .hidden-item').animate({opacity:1}, 500);
							obj0.scene2.rounded_chart(grupo);
							obj0.scene2.group_menu();
							obj0.scene2.ver_pais();
							obj0.navegacao_grupos();
							
					
			}, //start_scene
			rounded_chart: function(grupo){
					var grupo = grupo? grupo: "A";
					var data = obj0.get_data();
					var data_grupo = data['grupos'][grupo];
					
					var scalePercent = function(num) {
						total = Math.ceil(data_grupo['total_euro'].replace(',','.'));
						valor = Math.ceil(num.replace(',','.'));
						var angle = Math.round((100 * valor)/ total);
						return angle;
						}
					
					var scaleAngle = function(percent) {
						return Math.round((360 * percent)/100);
						}		
					
					cw = 140;
					ch = 140;
					var __grafico_arco = Raphael('grafico-paises', cw, ch);
		
					__grafico_arco.customAttributes.arc = function(value, color, rad, random){
						var v = 3.6*value,
							alpha = v == 360 ? 359.99 : v,
							//random = 90,
							a = (random-alpha) * Math.PI/180,
							b = random * Math.PI/180,
							sx = (cw/2) + rad * Math.cos(b),
							sy = (ch/2) - rad * Math.sin(b),
							x = (cw/2) + rad * Math.cos(a),
							y = (ch/2) - rad * Math.sin(a),
							path = [['M', sx, sy], ['A', rad, rad, 0, +(alpha > 180), 1, x, y]];
							return { path: path, stroke: color }
					}
					
					s2i3 = -1;
					$.each(data_grupo['selecoes'], function(nome, atributos){
						s2i3++;
						valor = data_grupo['selecoes'][nome]['valor_euro'];
						percent = scalePercent(valor);
						
						var scaleArcSize = function(n){
							if (n<-1) { return undefined };
							if (n==0 || n== -1) { return 0;}
							
      						else if (n==1) {
								var length = parseInt($('[data-index='+ (n - 1)+']').attr('data-length'));
								return -length;
							} else if(n==2){
								var length = parseInt($('[data-index='+ (n -(n-1)) +']').attr('data-length'));
								return -(length - scaleArcSize(n-1));
							} else {
								var length = parseInt($('[data-index='+ (n-1) +']').attr('data-length'));
								return -(length - scaleArcSize(n-1));
									}
							}
							
						start = scaleArcSize(s2i3);
						
						var __arc = __grafico_arco.path().attr({ arc: [percent, obj0.colors[s2i3], 66, start], 'stroke-width': 7 });
						__arc.node.setAttribute('data-grupo', data_grupo['nome']);
						__arc.node.setAttribute('data-pais', nome);
						__arc.node.setAttribute('data-shape', 'arc');
						__arc.node.setAttribute('data-index', s2i3);
						__arc.node.setAttribute('data-length', Math.ceil(scaleAngle(percent)));
						__arc.node.setAttribute('data-behaviour', 'hover-pais');
						__arc.node.setAttribute('data-stroke', 'cor' + (s2i3 + 1));											
						});
					
					var valor_grupo = data_grupo['total_real'];
					var format_total_grupo = accounting.formatNumber(valor_grupo, 1, ".", ",");
					if(valor_grupo > 1000) {
						format_total_grupo = accounting.formatNumber(Math.round(valor_grupo), 1, ".", ",");
						}
						
					tooltip_data = '<div class="tip-header"><small><span class="var-data">O grupo</span> vale</small></div>';
					tooltip_data += '<div class="tip-body"><big class="big2">'+format_total_grupo.replace(/\,0$/, '')+'</big></div>';
					tooltip_data += '<div class="tip-footer"><small>R$ em milhões</small></div>';
					
					$('#grafico-paises-data').append(tooltip_data);
					
			}, // chart
			group_menu: function(){
				s2i6 = 0;
				$('ul.grupos').each(function(){
					s2i6 ++;
					el = $(this).find('.svg-grupo');
						el.each(function(){
							g = $(this).attr('data-grupo');
							grupo_ativo = $('#grupos-mapa').attr('data-ativo');
							var __menu_item = Raphael("svg-grupo-" + g + '-' + s2i6, "32", "32");
							
							var __item = __menu_item.circle(15, 15, 13).attr({fill:'#5c5f67', 'stroke-width': '0'});
							__item.node.setAttribute('data-behaviour', 'click-grupo');
							__item.node.setAttribute('data-grupo', g);
							__item.node.setAttribute('data-shape', 'circle');
							
							if(g == grupo_ativo) {
								__item.attr({fill: '#e47f31'});
								}
							var __item_text = __menu_item.text(15, 15, g).attr({fill: '#FFF', 'font-size': '11px'});
							__item_text.node.setAttribute('data-behaviour', 'click-grupo');
							__item_text.node.setAttribute('data-grupo', g);
							__item_text.node.setAttribute('data-shape', 'text');
					});
				});
				
			},
			ver_pais: function(){
				grupo = $('#grupos-mapa').attr('data-ativo');
				var data = obj0.get_data();
				var data_grupo = data['grupos'][grupo];
					
				$('[data-behaviour=hover-pais][data-grupo='+grupo+']', '#grupos-mapa').on('mouseover',function(e){
						e.stopImmediatePropagation();
						
						// atualiza valores no gráfico	
						pais = $(this).attr('data-pais');
						var nome = data_grupo['selecoes'][pais]['nome'];
						var valor = data_grupo['selecoes'][pais]['valor_real'];
						var format_valor = accounting.formatNumber(valor, 1, ".", ",");
						
						if(valor > 1000){
							format_valor = accounting.formatNumber(Math.round(valor), 1, ".", ",").replace(/\,0$/, '');
							}
						
						$('big', '#grafico-paises-data').html(format_valor);
						$('.var-data', '#grafico-paises-data').html(nome);
						$(this).css({cursor: 'pointer'});
						
						// muda cores
						$('[data-pais='+pais+']', '#grupos-mapa').each(function(){
							class_list = $(this).attr('class') || '';
								if(class_list.indexOf('svg-pais') == -1) {
									$(this).attr('class', class_list + ' active');
								} 
							});
						
						//contorno bandeiras
						$('li[data-pais='+pais+'] .svg-pais', '#grupos-mapa .paises-grupos').css({ boxShadow: '0 0 0 3px #2e323d, 0 0 0 4px #FFF'});
						$('li[data-pais='+pais+'] .grupo-nome', '#grupos-mapa .paises-grupos').css({color: '#FFF'});

						// tooltip
						tooltip = '<div class="tooltip2 tooltip-' + pais +'">';
						tooltip += nome;
						tooltip += '</div>';
						$('#grupos-mapa').append(tooltip);
						
						var parent_offset = $('#mapa-selecoes').offset();
						var path_offset = $('[data-shape=country][data-pais='+pais+']').offset();
						var path_dimensions = copa2014.mundo[pais][0].getBBox();
						
						var tooltip_width = $('.tooltip-' + pais).width();
						var tooltip_height = 28;
						
						$('.tooltip-' + pais).css({
							left: (path_offset.left - parent_offset.left) + 35,
							top: (path_offset.top - parent_offset.top)
							});
						
						if(tooltip_width > path_dimensions.width) {
							$('.tooltip-' + pais).css({
								left: ((path_offset.left - parent_offset.left) + 35) - 32
							});
						}
						
						
						if((tooltip_height + 5) > path_dimensions.height) {
							$('.tooltip-' + pais).css({
								top: (path_offset.top - parent_offset.top) - (tooltip_height-2)
							});
						}
						
						/*países especiais com problemas:*/
						
						if(pais == 'russia') {
							$('.tooltip-russia').css({
								left: (path_offset.left - parent_offset.left) + 65,
								top: (path_offset.top - parent_offset.top) +70
								});	
						}
						
						if(pais == 'inglaterra') {
							$('.tooltip-inglaterra').css({
								top: (path_offset.top - parent_offset.top) -20
								});	
						}
						
						if(pais == 'japao') {
							$('.tooltip-japao').css({
								top: (path_offset.top - parent_offset.top) -50
								});	
						}
						
							
				
				}); // mouseover
					
				
				$('[data-behaviour=hover-pais][data-grupo='+grupo+']', '#grupos-mapa').on('mouseout',function(e){
						e.stopImmediatePropagation();
						var valor = data_grupo['total_real'];
						var format_valor = accounting.formatNumber(valor, 1, ".", ",");
						if(valor > 1000) {
							format_valor = accounting.formatNumber(Math.round(valor), 1, ".", ",");
							}
						// retorna valores do grupo
						$('big', '#grafico-paises-data').html(format_valor.replace(/\,0$/, ''));
						$('.var-data', '#grafico-paises-data').html('O grupo');
						$('.tooltip2').remove();
						
						// muda cores
						$('[data-pais='+pais+']', '#grupos-mapa').each(function(){
							class_list = $(this).attr('class') || '';
							empty_list = class_list.replace('active', '');
							$(this).attr('class', empty_list);
							});
						
						//contorno bandeiras
						$('.paises-grupos li .svg-pais', '#grupos-mapa').css({ boxShadow: ''});
						$('.paises-grupos li[data-pais='+pais+'] .grupo-nome', '#grupos-mapa').css({color: '#9ba5aa'});	
					});
					
			},
			clear_scene: function() {					
					// Reseta os valores da variável por conta do IE8					
					paises_grupo = [];
					$('.paises-grupos li').each(function(){
						paises_grupo.push($(this).attr('data-pais'));
						});
					
					for(pg =0; pg < paises_grupo.length; pg++) {
						el = paises_grupo[pg];
						for(p=0; p < copa2014.mundo[el].length; p++) {
							copa2014.mundo[el][p].attr({'fill': '#eef2f6'});
							}
						}						
					
					$('path', '#grupos-mapa').css({fill: '#eef2f6'}).attr('data-fill', '');
					$('.paises-grupos, #grafico-paises-data, .svg-grupo').empty();
					$('#grafico-paises svg, #grafico-paises .rvml').remove();
					$('[data-behaviour=hover-pais]').off('mouseover').css({cursor: 'default'});
					$('[data-behaviour=hover-pais]').off('mouseout');
					
			}	
		},// scene2
		scene3: {
			start_scene: function(grupo, pais) {
				var grupo = grupo? grupo: "A";
				var data = obj0.get_data();
				if(!data) { return false;}
				$('#pais-dinamico').animate({opacity:0}, 200);
				$('#grupos-detalhe').prepend('<div class="loader center"></div>');
				
				var selecoes = data['grupos'][grupo]['selecoes'];
				
				data_selecoes = [];
				$.each(selecoes, function(selecao, atributos){
					data_selecoes.push(selecao);
					});
				
				var pais = pais? pais: data_selecoes[0];
				var data_pais = selecoes[pais];		
					
				var json_data = {};
				json_data['pais'] =  encodeURIComponent(JSON.stringify(data_pais));
				json_data['get_pais'] = pais;
				
				 $.ajax({
					 url: 'inc/grupos-detalhe.php',
					 data: json_data,
					 method: 'GET',
					 dataType:'html',
					 success: function(scene){			 
							 $('#pais-dinamico').html(scene);
							 $('#grupos-detalhe .loader').remove();		
							 $('#pais-dinamico').animate({opacity:1}, 200);
							 $('#grupos-detalhe .hidden-item').animate({opacity:1}, 500);
							 
							 //data de atualização
							 $('.data-atualizacao').text('Atualizado em ' + data['data_atualizacao']);
							 
							 // monta ranking com as posições dos países
							 $('.lista-ranking li').each(function(){
								 if($(this).attr('data-pos') == data_pais['posicao']) {
									 $(this).addClass('active');
									 }
								 });	 
								 
							 //contorno bandeiras do país ativo
							$('.svg-pais', '#grupos-detalhe li[data-pais='+pais+']').css({boxShadow: '0 0 0 3px #FFF, 0 0 0 4px #2e323d', cursor: 'pointer'});
							
							$('.grupo-nome', '#grupos-detalhe li[data-pais='+pais+']').css({color: '#2e323d'});
							 // comportamento hover do menu de países
							$('.svg-pais', '#grupos-detalhe li').on('mouseover', function(){
								$(this).next('.grupo-nome').css({color: '#2e323d'});
								});
							
							$('.svg-pais', '#grupos-detalhe li').on('mouseout', function(){
								if($(this).closest('#grupos-detalhe li').attr('data-pais') != pais) {
									$(this).next('.grupo-nome').css({color: '#9ba5aa'});
								}
								});	  
							 
							 obj0.scene3.tooltip_patrocinador();
							 obj0.scene3.svg_icones(grupo, pais);
						 } 
					 });
				
				}, // start_scene
				tooltip_patrocinador: function(){
					$('.lista-patrocinadores li span').on('mouseover', function(e){
								e.stopImmediatePropagation();
								 JSON_data = obj0.get_data();
								 var el = $(this);
								 var patrocinador = $(this).text();
								 var selecoes = 'seleções';
								 var total_patrocinado = JSON_data['patrocinadores'][patrocinador];
								 if(total_patrocinado <=1) {
									 selecoes = 'seleção';
									 }

								 if(total_patrocinado) {
									 $(this).addClass('active');
									 tooltip = "<div class='tooltip1 rt'>";
									 tooltip += "<p><small>Patrocina</small></p>";
									 tooltip += "<p>"+ total_patrocinado +" <small>"+ selecoes +"</small></p>";
									 tooltip += "</div>";
									 parent_offset = $('.patrocinadores').offset();
									 el_offset = $(this).offset();
									 
									 $('.patrocinadores').append(tooltip);
									 
									 $('.patrocinadores .tooltip1').each(function(){
										 $(this).css({left: (el_offset.left - parent_offset.left) + el.width() + 10, top: ((el_offset.top - parent_offset.top) - $(this).height()) + 5}).animate({opacity: 1}, 200);
										 });
								 }
								 
								 
								 });
								 
								 $('.lista-patrocinadores li span').on('mouseout', function(){ 
								 	$(this).removeClass('active');
									
								 	$('.patrocinadores .tooltip1').animate({opacity: 0}, 200, function(){
										$(this).remove();
										});
								 });
					},
				svg_icones: function(grupo, pais){
							 var data = obj0.get_data();
							 var data_pais = data['grupos'][grupo]['selecoes'][pais];					
							 var bandeira = copa2014.flags[pais];
							 
							 var bola = copa2014.icones['bola'];
							 var chuteira = copa2014.icones['chuteira'];
							 var medalha = copa2014.icones['medalha'];
							 var tecnico = copa2014.icones['tecnico'];
							 
							 $('#big-flag-' + pais).svg({ path: bandeira, width: '60', height: '40', x: '0', y: '0' }).append('<span class="nome-pais">' + data_pais['nome'] + '</span>');
							 
							 $('#thumb-mais-caro').svg({ path: chuteira, width: '47', height: '23', x: '464', y: '1238.5' });		
							 $('#thumb-participacoes').svg({ path: bola, width: '30', height: '30', x: '472.5', y: '1235' });
							 
							 $('#thumb-vitorias').svg({ path: medalha, width: '22', height: '34', x: '476.5', y: '1233' });
							 $('#thumb-tecnico').svg({ path: tecnico, width: '45', height: '40', x: '465', y: '1230' });
					}	
			}// scene3
			
	}// return
})(); // function

$(document).ready(function () {
	copa2014.selecoes.init();
	
});


