
namespace('acme.maps.maptypes');
acme.maps.maptypes.Initialize = function () {
	acme.maps.maptypes.WORLDTOPO_MAP = acme.maps.maptypes.ArcGISCreateMap('Topo', 'Esri / ArcGIS', 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/', 1.0, 0, 19, [], 't');
	acme.maps.maptypes.USATOPO_MAP = acme.maps.maptypes.ArcGISCreateMap('Topo', 'ArcGIS', 'http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/', 1.0, 0, 15, [], 't');
	acme.maps.maptypes.DOQ_MAP = acme.maps.maptypes.WMSCreateMap('DOQ', 'Imagery by USGS / Service by TerraServer', 'http://www.terraserver-usa.com/ogcmap6.ashx', 'DOQ', 'image/jpeg', false, 1.0, 4, 18, [], 'o');
	acme.maps.maptypes.NEXRAD_MAP = acme.maps.maptypes.TMSCreateMap('NEXRAD', 'Data by NWS / Service by Iowa U. Ag. Dept.', 'http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0r-900913/', 0.666, 4, 10, G_HYBRID_MAP.getTileLayers(), 'n');

}
acme.maps.maptypes.WMSCreateMap = function (name, copyright, baseUrl, layer, format, transparent, opacity, minResolution, maxResolution, extraTileLayers, urlArg) {
	var tileLayer = new GTileLayer(new GCopyrightCollection(copyright), minResolution, maxResolution);
	tileLayer.baseUrl = baseUrl;
	tileLayer.layer = layer;
	tileLayer.format = format;
	tileLayer.transparent = transparent;
	tileLayer.getTileUrl = acme.maps.maptypes.WMSGetTileUrl;
	tileLayer.getOpacity = function () {
		return opacity;
	};
	tileLayer.getCopyright = function () {
		return {
			prefix : '',
			copyrightTexts : [copyright]
		};
	};
	var tileLayers = [];
	for (var i in extraTileLayers)
		tileLayers.push(extraTileLayers[i]);
	tileLayers.push(tileLayer);
	return new GMapType(tileLayers, G_SATELLITE_MAP.getProjection(), name, {
		urlArg : urlArg
	});
}
acme.maps.maptypes.WMSGetTileUrl = function (tile, zoom) {
	var southWestPixel = new GPoint(tile.x * 256, (tile.y + 1) * 256);
	var northEastPixel = new GPoint((tile.x + 1) * 256, tile.y * 256);
	var southWestCoords = G_NORMAL_MAP.getProjection().fromPixelToLatLng(southWestPixel, zoom);
	var northEastCoords = G_NORMAL_MAP.getProjection().fromPixelToLatLng(northEastPixel, zoom);
	var bbox = southWestCoords.lng() + ',' + southWestCoords.lat() + ',' + northEastCoords.lng() + ',' + northEastCoords.lat();
	var transparency = this.transparent ? '&TRANSPARENT=TRUE' : '';
	return this.baseUrl + '?VERSION=1.1.1&REQUEST=GetMap&LAYERS=' + this.layer + '&STYLES=&SRS=EPSG:4326&BBOX=' + bbox + '&WIDTH=256&HEIGHT=256&FORMAT=' + this.format + '&BGCOLOR=0xCCCCCC&EXCEPTIONS=INIMAGE' + transparency;
}
acme.maps.maptypes.TMSCreateMap = function (name, copyright, baseUrl, opacity, minResolution, maxResolution, extraTileLayers, urlArg) {
	var tileLayer = new GTileLayer(new GCopyrightCollection(copyright), minResolution, maxResolution);
	tileLayer.baseUrl = baseUrl;
	tileLayer.getTileUrl = acme.maps.maptypes.TMSGetTileUrl;
	tileLayer.getOpacity = function () {
		return opacity;
	};
	tileLayer.getCopyright = function () {
		return {
			prefix : '',
			copyrightTexts : [copyright]
		};
	};
	var tileLayers = [];
	for (var i in extraTileLayers)
		tileLayers.push(extraTileLayers[i]);
	tileLayers.push(tileLayer);
	return new GMapType(tileLayers, G_SATELLITE_MAP.getProjection(), name, {
		urlArg : urlArg
	});
}
acme.maps.maptypes.TMSGetTileUrl = function (tile, zoom) {
	return this.baseUrl + zoom + '/' + tile.x + '/' + tile.y + '.png';
}
acme.maps.maptypes.ArcGISCreateMap = function (name, copyright, baseUrl, opacity, minResolution, maxResolution, extraTileLayers, urlArg) {
	var tileLayer = new GTileLayer(new GCopyrightCollection(copyright), minResolution, maxResolution);
	tileLayer.baseUrl = baseUrl;
	tileLayer.getTileUrl = acme.maps.maptypes.ArcGISGetTileUrl;
	tileLayer.getOpacity = function () {
		return opacity;
	};
	tileLayer.getCopyright = function () {
		return {
			prefix : '',
			copyrightTexts : [copyright]
		};
	};
	var tileLayers = [];
	for (var i in extraTileLayers)
		tileLayers.push(extraTileLayers[i]);
	tileLayers.push(tileLayer);
	return new GMapType(tileLayers, G_SATELLITE_MAP.getProjection(), name, {
		urlArg : urlArg
	});
}
acme.maps.maptypes.ArcGISGetTileUrl = function (tile, zoom) {
	return this.baseUrl + zoom + '/' + tile.y + '/' + tile.x;
}
