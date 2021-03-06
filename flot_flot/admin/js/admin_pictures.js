
var s_term = "";
var s_mode = "browse";
var i_page = 1;

var xhr_image_search_requst;


$(function () {
	$('#fileupload').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$.each(data.result.files, function (index, file) {
				$('<p/>').text(file.name).appendTo($("#upload_output"));
			});
	        $("#upload_output").html("");
	        _pic_search();
		},
		fail: function (e, data) {
			_log_failure(data.errorThrown + " (" + data.textStatus + ')');
	        _pic_search();
		},
		progressall: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        $('#progress .bar').css(
	            'width',
	            progress + '%'
	        );
	        $("#upload_output").html("uploading.. "+progress+"%");
	    }
	});


	$("#file_browser_text_search").keyup(function() {
		s_term = $("#file_browser_text_search").val();
		_pic_search();
		console.log("searching: "+s_term);
	});
});

function _pic_search(){
	if(xhr_image_search_requst !== undefined){
		// we don't want to handle the result of previous requests, if we're making a new one.
		xhr_image_search_requst.abort();
	}
	xhr_image_search_requst = $.get('/flot_flot/admin/search_pics.php',{"term": s_term, "mode": s_mode}, function(data){
		$("#picture_browser_results").html(data);
	});
}

var s_file_selected = "";
var s_file_size = "medium";

function selected_picture(s_filename){
	s_file_selected = "/" + s_upload_dir + "/" + s_file_size + "/" + s_filename;
	console.log(s_filename);
	chooseFile();
}

var sa_selected = [];

function select_picture(s_filename){
	if($.inArray(s_filename, sa_selected) > -1){
		// file already there, deselect it
		sa_selected.splice(sa_selected.indexOf(s_filename),1);
	}else{
		// add to selected
		sa_selected.push(s_filename);
	}
	show_selected_pics();
}
function show_selected_pics(){
	var html_selected_images = "";

	for(var cSelected = 0; cSelected < sa_selected.length; cSelected++){
		html_selected_images += '<img src="/flot_flot/uploads/tiny/'+sa_selected[cSelected]+'" />';
	}

	$("#file_browser_selected").html(html_selected_images);

	if(sa_selected.length > 0){
		// enable insert button
		$("#file_browser_insert_selected").removeClass('disabled');
	}else{
		// disable insert button
		$("#file_browser_insert_selected").addClass('disabled');
	}
}
function insert_selected_pictures(s_upload_dir, s_size){
	var html_selected_images = "";
	for(var cSelected = 0; cSelected < sa_selected.length; cSelected++){
		html_selected_images += '<img src="/'+s_upload_dir+'/'+s_size+'/'+sa_selected[cSelected]+'" />';
	}
	CKEDITOR.instances.wysiwyg_editor.insertHtml(html_selected_images);
	$('#file_browser_modal').modal('hide');
	// reset selected
	sa_selected = [];
}
function _log_failure(s_message){
	//$("#upload_failure").html(s_message);
	$("#upload_output").html('');
	$("#upload_failure").html('<div class="alert alert-danger alert-dismissable">  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>  <strong>Upload error</strong> '+s_message+'</div>');
}