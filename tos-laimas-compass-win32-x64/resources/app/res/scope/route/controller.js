app
    .controller('routeController', function ($scope, dataService, $state) {
        $scope.data = dataService;

        $scope.from = $state.params.from;
        $scope.to = $state.params.to;

        var Graph = function (t) { var r = function (t) { var r, n = []; for (r in t) Object.prototype.hasOwnProperty.call(t, r) && n.push(r); return n }, n = function (t, r) { return parseFloat(t) - parseFloat(r) }, e = function (e, o, a, u) { u = u || 1 / 0; var p, c = {}, i = { 0: [o] }, s = {}, l = function (t, r) { var n = "" + t; i[n] || (i[n] = []), i[n].push(r) }; for (c[o] = 0; i && (p = r(i)).length;) { p.sort(n); var h = p[0], f = i[h], g = f.shift(), y = parseFloat(h), v = e[g] || {}; f.length || delete i[h]; for (var m in v) if (Object.prototype.hasOwnProperty.call(v, m)) { var b = v[m], j = b + y, O = c[m]; (O === t || O > j) && (c[m] = j, l(j, m), s[m] = g) } } return c[a] === t ? null : s }, o = function (t, r) { for (var n = [], e = r; e;)n.push(e), predecessor = t[e], e = t[e]; return n.reverse(), n }, a = function (t, r) { for (var n, a, u, p = r.shift(), c = []; r.length;) { if (n = r.shift(), a = e(t, p, n), !a) return null; if (u = o(a, n), !r.length) return c.concat(u); c.push.apply(c, u.slice(0, -1)), p = n } }, u = function (t, r) { try { return Array.prototype.slice.call(t, r) } catch (n) { for (var e = [], o = r || 0, a = t.length; a > o; ++o)e.push(t[o]); return e } }, p = function (t) { this.map = t }; return p.prototype.findShortestPath = function (t, r) { return "[object Array]" === Object.prototype.toString.call(t) ? a(this.map, t) : 2 === arguments.length ? a(this.map, [t, r]) : a(this.map, u(arguments)) }, p.findShortestPath = function (t, r, n) { return "[object Array]" === Object.prototype.toString.call(r) ? a(t, r) : 3 === arguments.length ? a(t, [r, n]) : a(t, u(arguments, 1)) }, p } ();

        $scope.changePath = function () {
            console.log('Changing');
            $state.go('route', { from: $scope.from, to: $scope.to }, { notify: true });
        };


        $scope.doPath = function () {
            if ($scope.data.nodes) {
                console.log('Pathing');
                var graph = new Graph($scope.data.nodes);
                $scope.route = graph.findShortestPath($state.params.from, $state.params.to);



                if ($scope.route) {
                    routeCollection.clear();

                    var prevPos = null;
                    var newPos = null;

                    angular.forEach($scope.route, function (ii) {

                        var i = $scope.data.maps[ii];

                        if (i.posX) {

                            var newPos = [i.posX, i.posY];

                            routeCollection.addFeature(new ol.Feature({
                                geometry: new ol.geom.Point(newPos),
                                style: new ol.style.Style({ image: new ol.style.Circle({ radius: 15, fill: new ol.style.Fill({ color: 'rgba(255,0,0,1)' }) }) })
                            }));

                            if (prevPos) {
                                console.log(" -> " + i.Name + ": " + JSON.stringify(newPos));
                                routeCollection.addFeature(new ol.Feature({
                                    geometry: new ol.geom.LineString([prevPos, newPos]),
                                    style: new ol.style.Style({
                                        stroke: new ol.style.Stroke({
                                            color: '#f00',
                                            width: 8
                                        })
                                    })
                                }));
                            }

                            prevPos = [i.posX, i.posY];
                        }

                    });






                }

            }
        };

        $scope.$watch(
            "data.nodes", function () {
                $scope.doPath();
                if ($scope.data.nodes) {
                    $scope.populateMapFeatures();
                }

            }
        );
        $scope.$watch(
            "data.maps", function () {

                if ($scope.maps)
                    $scope.populateMapFeatures();
            }
        );



        function createMapText(txt, img) {
            return new ol.style.Style({
                text: new ol.style.Text({
                    text: txt,
                    offsetX: 13,

                    fill: new ol.style.Fill({ color: '#fff' }),
                    stroke: new ol.style.Stroke({ color: '#3b2110', width: 5 }),
                    font: '12px quattrocento',
                    textAlign: 'left'

                })
            });
        }

        function createMapIcon(src, img) {
            return new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 0.5],
                    src: src,
                    img: img,
                    imgSize: img ? [img.width, img.height] : undefined
                }))
            });
        }

        var icon = {
            cw: createMapIcon('res/img/i-cw.png'),
            c: createMapIcon('res/img/i-c.png'),
            dw: createMapIcon('res/img/i-dw.png'),
            d: createMapIcon('res/img/i-dw.png'),
            fw: createMapIcon('res/img/i-fw.png'),
            f: createMapIcon('res/img/i-c.png')
        };



        function createMarker(label, x, y, style) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(location)
            });
            iconFeature.setStyle(style);

            return iconFeature
        }



        // Prepare map markers

        $scope.populateMapFeatures = function () {

            angular.forEach($scope.data.maps, function (i) {

                if (i.posX) {

                    var iconFeature = new ol.Feature(new ol.geom.Point([i.posX, i.posY]));

                    var iid = i.MapType[0].toLowerCase() + (i.HasWarp ? "w" : "");

                    iconFeature.set('style', icon[iid]);
                    iconCollection.addFeature(iconFeature);

                    iconFeature = new ol.Feature(new ol.geom.Point([i.posX, i.posY]));

                    iconFeature.set('style', createMapText(i.Name || i.ClassName));
                    labelCollection.addFeature(iconFeature);
                }
            });
        };


        var iconCollection = new ol.source.Vector({});
        var labelCollection = new ol.source.Vector({});
        var routeCollection = new ol.source.Vector({});

        var extent = [0, 0, 1784, 3677];
        var projection = new ol.proj.Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: extent
        });

        var map = new ol.Map({
            layers: [
                new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                        attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
                        url: 'res/img/map.jpg',
                        projection: projection,
                        imageExtent: extent
                    })
                }),
                new ol.layer.Vector({ style: function (feature) { return feature.get('style'); }, source: labelCollection, maxResolution: 2 }),
                new ol.layer.Vector({ style: function (feature) { return feature.get('style'); }, source: routeCollection }),
                new ol.layer.Vector({ style: function (feature) { return feature.get('style'); }, source: iconCollection })
            ],
            target: 'map',
            view: new ol.View({
                projection: projection,
                center: ol.extent.getCenter(extent),
                zoom: 2,
                maxZoom: 8
            })
        });


        var selectStyle = {};

        var select = new ol.interaction.Select({
            style: function (feature) {
                var image = feature.get('style').getImage().getImage();
                if (!selectStyle[image.src]) {
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0, image.width, image.height);
                    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    var data = imageData.data;
                    for (var i = 0, ii = data.length; i < ii; i = i + (i % 4 == 2 ? 2 : 1)) {
                        data[i] = 255 - data[i];
                    }
                    context.putImageData(imageData, 0, 0);
                    selectStyle[image.src] = createStyle(undefined, canvas);
                }
                return selectStyle[image.src];
            }
        });
        map.addInteraction(select);

        map.on('pointermove', function (evt) {
            map.getTargetElement().style.cursor =
                map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
        });


    });
