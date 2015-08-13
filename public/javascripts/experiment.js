var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var megsToSend = document.querySelector('input#megsToSend');
var sendButton = document.querySelector('button#sendTheData');
var orderedCheckbox = document.querySelector('input#ordered');
var sendProgress = document.querySelector('progress#sendProgress');
var receiveProgress = document.querySelector('progress#receiveProgress');

var receivedSize = 0;
var bytesToSend = 0;

var bitrateMax = 0;


$(function() {
	$( "#startButton" ).click(function() {
		createConnection();
	});




});


function createConnection() {
  var servers = null;
  pcConstraint = null;

  bytesToSend = 1 * 1024 * 1024;

  // Add localConnection to global scope to make it visible from the browser console.
  window.localConnection = localConnection = new RTCPeerConnection(servers,
      pcConstraint);
  
  alert('Created local peer connection object localConnection');

  var dataChannelParams = {ordered: false};
  if (orderedCheckbox.checked) {
    dataChannelParams.ordered = true;
  }

  sendChannel = localConnection.createDataChannel(
      'sendDataChannel', dataChannelParams);
  sendChannel.binaryType = 'arraybuffer';
  trace('Created send data channel');

  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;
  localConnection.onicecandidate = iceCallback1;

  localConnection.createOffer(gotDescription1, onCreateSessionDescriptionError);

  // Add remoteConnection to global scope to make it visible from the browser console.
  window.remoteConnection = remoteConnection = new RTCPeerConnection(servers,
      pcConstraint);
  trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = iceCallback2;
  remoteConnection.ondatachannel = receiveChannelCallback;
}