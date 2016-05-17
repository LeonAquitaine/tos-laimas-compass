app
    .controller('logController', function ($scope, dataService) {

        $scope.data = dataService;

        var Graph = function (t) { var r = function (t) { var r, n = []; for (r in t) Object.prototype.hasOwnProperty.call(t, r) && n.push(r); return n }, n = function (t, r) { return parseFloat(t) - parseFloat(r) }, e = function (e, o, a, u) { u = u || 1 / 0; var p, c = {}, i = { 0: [o] }, s = {}, l = function (t, r) { var n = "" + t; i[n] || (i[n] = []), i[n].push(r) }; for (c[o] = 0; i && (p = r(i)).length;) { p.sort(n); var h = p[0], f = i[h], g = f.shift(), y = parseFloat(h), v = e[g] || {}; f.length || delete i[h]; for (var m in v) if (Object.prototype.hasOwnProperty.call(v, m)) { var b = v[m], j = b + y, O = c[m]; (O === t || O > j) && (c[m] = j, l(j, m), s[m] = g) } } return c[a] === t ? null : s }, o = function (t, r) { for (var n = [], e = r; e;)n.push(e), predecessor = t[e], e = t[e]; return n.reverse(), n }, a = function (t, r) { for (var n, a, u, p = r.shift(), c = []; r.length;) { if (n = r.shift(), a = e(t, p, n), !a) return null; if (u = o(a, n), !r.length) return c.concat(u); c.push.apply(c, u.slice(0, -1)), p = n } }, u = function (t, r) { try { return Array.prototype.slice.call(t, r) } catch (n) { for (var e = [], o = r || 0, a = t.length; a > o; ++o)e.push(t[o]); return e } }, p = function (t) { this.map = t }; return p.prototype.findShortestPath = function (t, r) { return "[object Array]" === Object.prototype.toString.call(t) ? a(this.map, t) : 2 === arguments.length ? a(this.map, [t, r]) : a(this.map, u(arguments)) }, p.findShortestPath = function (t, r, n) { return "[object Array]" === Object.prototype.toString.call(r) ? a(t, r) : 3 === arguments.length ? a(t, [r, n]) : a(t, u(arguments, 1)) }, p } ();

        $scope.calcRoute = function (destinyIdClass) {

            console.log("from: " + $scope.data.event.MapData.ClassID);
            console.log("to: " + destinyIdClass);

            var graph = new Graph($scope.data.nodes);
            $scope.route = graph.findShortestPath($scope.data.event.MapData.ClassID, destinyIdClass);

            console.log($scope.route);
        };

        $scope.delRoute = function () {
            delete $scope.route;
        };
        
        $scope.showAll = true;

    });
