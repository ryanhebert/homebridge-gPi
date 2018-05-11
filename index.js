var request = require("request");
var Accessory, Service, Characteristic;

module.exports = function(homebridge) {

    //Accessory = homebridge.hap.Accessory
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-gPi", "Irrigation-Zone", h2oValve);
    homebridge.registerAccessory("homebridge-gPi", "Irrigation-Controller", h2oController);
    homebridge.registerAccessory("homebridge-gPi", "Irrigation-SimpleMode", h2oSimpleMode);
}

///////////////////////////////////////////////////////////
//
//    New Accessory
//
///////////////////////////////////////////////////////////

function h2oController(log, config) {

  this.log = log;
  this.config = config;
  this.name = config["name"];

  //if(config['Module']){}
  //if(config['SerialNumber']){}

  this.service = new Service.IrrigationSystem(this.name);

  this.service
    .setCharacteristic(Characteristic.Manufacturer, "Hebert Labs")
    .setCharacteristic(Characteristic.Model, "GaragePi")
    .setCharacteristic(Characteristic.SerialNumber, "0001");

  this.service
    .getCharacteristic(Characteristic.Active)
    .on('get', this.getActive.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.ProgramMode)
    .on('get', this.getProgramMode.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.InUse)
    .on('get', this.getInUse.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.RemainingDuration)
    .on('get', this.getRemainingDuration.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.StatusFault)
    .on('get', this.getStatusFault.bind(this)
  );
}

///////////////////////////////////////////////////////////
//
//    API Calls
//
///////////////////////////////////////////////////////////

h2oController.prototype.getActive = function(callback) {
    callback(null, 1);
}
h2oController.prototype.getProgramMode = function(callback) {
    callback(null, 1);
}
h2oController.prototype.getInUse = function(callback) {
    callback(null, 1);
}
h2oController.prototype.getRemainingDuration = function(callback) {
    callback(null, 3600);
}
h2oController.prototype.getStatusFault = function(callback) {
    callback(null, 1);
}

///////////////////////////////////////////////////////////
//
//    callback function
//
///////////////////////////////////////////////////////////

h2oController.prototype.getServices = function() {

  console.log(JSON.stringify(this, null, 2));

  return [this.service];
}



///////////////////////////////////////////////////////////
//
//    New Accessory
//
///////////////////////////////////////////////////////////

function h2oValve(log, config) {

  this.log = log;
  this.config = config;
  this.name = config["name"];

  this.service = new Service.Valve(this.name);

  this.service
    .setCharacteristic(Characteristic.Manufacturer, "Hebert Labs")
    .setCharacteristic(Characteristic.Model, "GaragePi")
    .setCharacteristic(Characteristic.SerialNumber, "0001");
  
  //required services
  this.service
    .getCharacteristic(Characteristic.Active)
    .on('get', this.getActive.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.InUse)
    .on('get', this.getInUse.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.ValveType)
    .on('get', this.getValveType.bind(this)
  );

  this.service
    .getCharacteristic(Characteristic.SetDuration)
    .on('get', this.getDuration.bind(this))
    .on('set', this.setDuration.bind(this));

  this.service
    .getCharacteristic(Characteristic.RemainingDuration)
    .on('get', this.getRemainingDuration.bind(this))
    .on('set', this.setRemainingDuration.bind(this));

  this.service.getCharacteristic(Characteristic.IsConfigured).on('get', this.getIsConfigured.bind(this));
}


///////////////////////////////////////////////////////////
//
//    API Calls
//
///////////////////////////////////////////////////////////

h2oValve.prototype.getActive = function(callback) {
    callback(null, 0);
}
h2oValve.prototype.getInUse = function(callback) {
    callback(null, 0);
}
h2oValve.prototype.getValveType = function(callback) {
    callback(null, 1);
}
h2oValve.prototype.getDuration = function(callback) {
    callback(null, 360);
}
h2oValve.prototype.setDuration = function(callback) {
    callback(null, 360);
}
h2oValve.prototype.getRemainingDuration = function(callback) {
    callback(null, 360);
}
h2oValve.prototype.setRemainingDuration = function(callback) {
    callback(null, 360);
}
h2oValve.prototype.getIsConfigured = function(callback) {
    callback(null, 1);
}

///////////////////////////////////////////////////////////
//
//    callback function
//
///////////////////////////////////////////////////////////

h2oValve.prototype.getServices = function() {
  return [this.service];
}

///////////////////////////////////////////////////////////
//
//    New Accessory
//
///////////////////////////////////////////////////////////

function h2oSimpleMode(log, config) {

  this.log = log;
  this.config = config;
  this.name = config["name"];

  this.service = new Service.Switch(this.name);

/*
  this.service
    .setCharacteristic(Characteristic.Manufacturer, "Hebert Labs")
    .setCharacteristic(Characteristic.Model, "GaragePi")
    .setCharacteristic(Characteristic.SerialNumber, "0001");
*/
  
  //required services
  this.service.getCharacteristic(Characteristic.On).on('get', this._get.bind(this)).on('set', this._set.bind(this));
}


///////////////////////////////////////////////////////////
//
//    API Calls
//
///////////////////////////////////////////////////////////

h2oSimpleMode.prototype._set = function (state, callback){

  var options = { 
    method: 'POST',
    url: 'http://localhost:5000/toggleSimpleStart',
    headers: {
      'Cache-Control': 'no-cache' 
    } 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    callback(null); });
}

h2oSimpleMode.prototype._get = function(callback){
  
    var options = { 
    method: 'GET',
    url: 'http://localhost:5000/getRunning',
    headers: {
      'Cache-Control': 'no-cache' 
    } 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    callback(null); });
}


///////////////////////////////////////////////////////////
//
//    callback function
//
///////////////////////////////////////////////////////////

h2oSimpleMode.prototype.getServices = function() {
  return [this.service];
}
