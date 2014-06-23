// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jquery', 'socket-io'], function($, ioSocket) {
    var Editor;

    Editor = (function() {
      var activeOptionSelector, id;

      activeOptionSelector = '#editor-file option:selected';

      id = 'editor';

      function Editor() {
        this._getCurrentExecuteCommand = __bind(this._getCurrentExecuteCommand, this);
        this._getCurrentLanguage = __bind(this._getCurrentLanguage, this);
        this._getCurrentFileName = __bind(this._getCurrentFileName, this);
        this._initExecuteHandler = __bind(this._initExecuteHandler, this);
        this._saveNewFileContent = __bind(this._saveNewFileContent, this);
        this._initSaveHandler = __bind(this._initSaveHandler, this);
        this._createEditor = __bind(this._createEditor, this);
        this._loadNewFile = __bind(this._loadNewFile, this);
        this._initChangeHandler = __bind(this._initChangeHandler, this);
        this._initSocket = __bind(this._initSocket, this);        this._initSocket();
        this._initChangeHandler();
        this._initSaveHandler();
        this._initExecuteHandler();
        this._editorContent = "";
        this._loadNewFile();
      }

      Editor.prototype._initSocket = function() {
        var _this = this;

        this._socket = ioSocket.connect();
        this._socket.on('connect', function() {
          return console.log('connect');
        });
        return this._socket.on('disconnect', function() {
          return console.log('disconnect');
        });
      };

      Editor.prototype._initChangeHandler = function() {
        return $('#editor-file').change(this._loadNewFile);
      };

      Editor.prototype._loadNewFile = function() {
        var fileName,
          _this = this;

        fileName = this._getCurrentFileName();
        return this._socket.emit('file', {
          fileName: fileName
        }, function(data) {
          if (data.error == null) {
            _this._createEditor(_this._getCurrentLanguage());
            editAreaLoader.setValue(id, data.content);
            $('#' + id).attr('data-file', fileName).attr('data-execute', _this._getCurrentExecuteCommand());
            $('.ouput').text('');
            return _this._editorContent = data.content;
          } else {
            return console.log("Error loading file: " + data.error);
          }
        });
      };

      Editor.prototype._createEditor = function(language) {
        return editAreaLoader.init({
          id: id,
          syntax: language,
          start_highlight: true,
          allow_resize: "no",
          allow_toggle: true,
          language: "en",
          toolbar: "Editor",
          replace_tab_by_spaces: 4,
          min_height: 350
        });
      };

      Editor.prototype._initSaveHandler = function() {
        return setInterval(this._saveNewFileContent, 300);
      };

      Editor.prototype._saveNewFileContent = function() {
        var fileName, language, newEditorContent;

        fileName = $('#' + id).attr('data-file');
        language = $('#' + id).attr('data-language');
        newEditorContent = editAreaLoader.getValue(id);
        if (newEditorContent !== this._editorContent) {
          this._socket.emit('changeFile', {
            fileName: fileName,
            content: newEditorContent
          });
          return this._editorContent = newEditorContent;
        }
      };

      Editor.prototype._initExecuteHandler = function() {
        var _this = this;

        return $('#execute').click(function() {
          var executeCommand, fileName;

          executeCommand = $('#' + id).attr('data-execute');
          fileName = $('#' + id).attr('data-file');
          $('.output').text("Executing ... Please wait!");
          return _this._socket.emit('execute', {
            fileName: fileName,
            command: executeCommand
          }, function(data) {
            return $('.output').text(data.output);
          });
        });
      };

      Editor.prototype._getCurrentFileName = function() {
        return $('#editor-file').attr('data-base-path') + '/' + $('#editor-file option:selected').attr('value');
      };

      Editor.prototype._getCurrentLanguage = function() {
        return $(activeOptionSelector).attr('data-language');
      };

      Editor.prototype._getCurrentExecuteCommand = function() {
        return $(activeOptionSelector).attr('data-execute');
      };

      return Editor;

    })();
    return $(function() {
      return new Editor();
    });
  });

}).call(this);

/*
//@ sourceMappingURL=editor.map
*/