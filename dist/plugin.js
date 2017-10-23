'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _dropbox = require('dropbox');

var _dropbox2 = _interopRequireDefault(_dropbox);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _fulcrumDesktopPlugin = require('fulcrum-desktop-plugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const token = process.env.DROPBOX_ACCESS_TOKEN;

if (!token) {
  console.log('No Dropbox access token was supplied.');
  console.log('Set your token with "export DROPBOX_ACCESS_TOKEN=your_token".');
}

const dbx = new _dropbox2.default({ accessToken: token });

_mkdirp2.default.sync(_path2.default.join(__dirname, 'tmp'));

exports.default = class {
  constructor() {
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      const account = yield fulcrum.fetchAccount(fulcrum.args.org);

      if (account) {
        yield _this.activate();
      } else {
        console.error('Unable to find account', fulcrum.args.org);
      }
    });

    this.handlePhotoSave = (() => {
      var _ref2 = _asyncToGenerator(function* ({ account, photo }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getPhotoURL(account, photo);
        yield _this.uploadFile(account, photo, downloadURL, `/photos/${photo.id}.jpg`);
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.handleVideoSave = (() => {
      var _ref3 = _asyncToGenerator(function* ({ account, video }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getVideoURL(account, video);
        yield _this.uploadFile(account, video, downloadURL, `/videos/${video.id}.mp4`);
      });

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    })();

    this.handleAudioSave = (() => {
      var _ref4 = _asyncToGenerator(function* ({ account, audio }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getAudioURL(account, audio);
        yield _this.uploadFile(account, audio, downloadURL, `/audio/${audio.id}.m4a`);
      });

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    })();

    this.handleSignatureSave = (() => {
      var _ref5 = _asyncToGenerator(function* ({ account, signature }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getSignatureURL(account, signature);
        yield _this.uploadFile(account, signature, downloadURL, `/signatures/${signature.id}.png`);
      });

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    })();
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'dropbox',
        desc: 'add new photos, videos, audio, and signatures to Dropbox',
        builder: {
          org: {
            desc: 'organization name',
            required: true,
            type: 'string'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

  tempPath(media) {
    return _path2.default.join(__dirname, 'tmp', media.id);
  }

  activate() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      fulcrum.on('photo:save', _this3.handlePhotoSave);
      fulcrum.on('video:save', _this3.handleVideoSave);
      fulcrum.on('audio:save', _this3.handleAudioSave);
      fulcrum.on('signature:save', _this3.handleSignatureSave);
    })();
  }

  deactivate() {
    return _asyncToGenerator(function* () {})();
  }

  uploadFile(account, media, url, name) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const tempFile = _this4.tempPath(media);
      yield _fulcrumDesktopPlugin.APIClient.download(url, tempFile);
      return dbx.filesUpload({ path: name, contents: _fs2.default.readFileSync(tempFile) }).then(function (resp) {
        _rimraf2.default.sync(tempFile);
      }).catch(function (err) {
        console.log(err);
      });
    })();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3BsdWdpbi5qcyJdLCJuYW1lcyI6WyJ0b2tlbiIsInByb2Nlc3MiLCJlbnYiLCJEUk9QQk9YX0FDQ0VTU19UT0tFTiIsImNvbnNvbGUiLCJsb2ciLCJkYngiLCJhY2Nlc3NUb2tlbiIsInN5bmMiLCJqb2luIiwiX19kaXJuYW1lIiwicnVuQ29tbWFuZCIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImFjdGl2YXRlIiwiZXJyb3IiLCJoYW5kbGVQaG90b1NhdmUiLCJwaG90byIsImRvd25sb2FkVVJMIiwiZ2V0UGhvdG9VUkwiLCJ1cGxvYWRGaWxlIiwiaWQiLCJoYW5kbGVWaWRlb1NhdmUiLCJ2aWRlbyIsImdldFZpZGVvVVJMIiwiaGFuZGxlQXVkaW9TYXZlIiwiYXVkaW8iLCJnZXRBdWRpb1VSTCIsImhhbmRsZVNpZ25hdHVyZVNhdmUiLCJzaWduYXR1cmUiLCJnZXRTaWduYXR1cmVVUkwiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwicmVxdWlyZWQiLCJ0eXBlIiwiaGFuZGxlciIsInRlbXBQYXRoIiwibWVkaWEiLCJvbiIsImRlYWN0aXZhdGUiLCJ1cmwiLCJuYW1lIiwidGVtcEZpbGUiLCJkb3dubG9hZCIsImZpbGVzVXBsb2FkIiwicGF0aCIsImNvbnRlbnRzIiwicmVhZEZpbGVTeW5jIiwidGhlbiIsInJlc3AiLCJjYXRjaCIsImVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxRQUFRQyxRQUFRQyxHQUFSLENBQVlDLG9CQUExQjs7QUFFQSxJQUFJLENBQUNILEtBQUwsRUFBWTtBQUNWSSxVQUFRQyxHQUFSLENBQVksdUNBQVo7QUFDQUQsVUFBUUMsR0FBUixDQUFZLCtEQUFaO0FBQ0Q7O0FBRUQsTUFBTUMsTUFBTSxzQkFBWSxFQUFDQyxhQUFhUCxLQUFkLEVBQVos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TixjQUFRK0IsRUFBUixDQUFXLFlBQVgsRUFBeUIsT0FBS25CLGVBQTlCO0FBQ0FaLGNBQVErQixFQUFSLENBQVcsWUFBWCxFQUF5QixPQUFLaEIsZUFBOUI7QUFDQWYsY0FBUStCLEVBQVIsQ0FBVyxnQkFBWCxFQUE2QixPQUFLYixtQkFBbEM7QUFKZTtBQUtoQjs7QUFFS2MsWUFBTixHQUFtQjtBQUFBO0FBQ2xCOztBQXNCS3RCLFlBQU4sQ0FBaUJYLE9BQWpCLEVBQTBCK0IsS0FBMUIsRUFBaUNHLEdBQWpDLEVBQXNDQyxJQUF0QyxFQUE0QztBQUFBOztBQUFBO0FBQzFDLFlBQU1DLFdBQVcsT0FBS04sUUFBTCxDQUFjQyxLQUFkLENBQWpCO0FBQ0EsWUFBTSxnQ0FBVU0sUUFBVixDQUFtQkgsR0FBbkIsRUFBd0JFLFFBQXhCLENBQU47QUFDQSxhQUFPMUMsSUFBSTRDLFdBQUosQ0FBZ0IsRUFBQ0MsTUFBTUosSUFBUCxFQUFhSyxVQUFVLGFBQUdDLFlBQUgsQ0FBZ0JMLFFBQWhCLENBQXZCLEVBQWhCLEVBQ0pNLElBREksQ0FDQyxVQUFVQyxJQUFWLEVBQWdCO0FBQ3BCLHlCQUFPL0MsSUFBUCxDQUFZd0MsUUFBWjtBQUNELE9BSEksRUFJSlEsS0FKSSxDQUlFLFVBQVVDLEdBQVYsRUFBZTtBQUNwQnJELGdCQUFRQyxHQUFSLENBQVlvRCxHQUFaO0FBQ0QsT0FOSSxDQUFQO0FBSDBDO0FBVTNDO0FBdEVrQixDIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBEcm9wYm94IGZyb20gJ2Ryb3Bib3gnO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IHJpbXJhZiBmcm9tICdyaW1yYWYnO1xuaW1wb3J0IHsgQVBJQ2xpZW50IH0gZnJvbSAnZnVsY3J1bSc7XG5cbmNvbnN0IHRva2VuID0gcHJvY2Vzcy5lbnYuRFJPUEJPWF9BQ0NFU1NfVE9LRU47XG5cbmlmICghdG9rZW4pIHtcbiAgY29uc29sZS5sb2coJ05vIERyb3Bib3ggYWNjZXNzIHRva2VuIHdhcyBzdXBwbGllZC4nKTtcbiAgY29uc29sZS5sb2coJ1NldCB5b3VyIHRva2VuIHdpdGggXCJleHBvcnQgRFJPUEJPWF9BQ0NFU1NfVE9LRU49eW91cl90b2tlblwiLicpO1xufVxuXG5jb25zdCBkYnggPSBuZXcgRHJvcGJveCh7YWNjZXNzVG9rZW46IHRva2VufSk7XG5cbm1rZGlycC5zeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICd0bXAnKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ2Ryb3Bib3gnLFxuICAgICAgZGVzYzogJ2FkZCBuZXcgcGhvdG9zLCB2aWRlb3MsIGF1ZGlvLCBhbmQgc2lnbmF0dXJlcyB0byBEcm9wYm94JyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgb3JnOiB7XG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICB0ZW1wUGF0aChtZWRpYSkge1xuICAgIHJldHVybiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndG1wJywgbWVkaWEuaWQpO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgZnVsY3J1bS5mZXRjaEFjY291bnQoZnVsY3J1bS5hcmdzLm9yZyk7XG5cbiAgICBpZiAoYWNjb3VudCkge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVbmFibGUgdG8gZmluZCBhY2NvdW50JywgZnVsY3J1bS5hcmdzLm9yZyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWN0aXZhdGUoKSB7XG4gICAgZnVsY3J1bS5vbigncGhvdG86c2F2ZScsIHRoaXMuaGFuZGxlUGhvdG9TYXZlKTtcbiAgICBmdWxjcnVtLm9uKCd2aWRlbzpzYXZlJywgdGhpcy5oYW5kbGVWaWRlb1NhdmUpO1xuICAgIGZ1bGNydW0ub24oJ2F1ZGlvOnNhdmUnLCB0aGlzLmhhbmRsZUF1ZGlvU2F2ZSk7XG4gICAgZnVsY3J1bS5vbignc2lnbmF0dXJlOnNhdmUnLCB0aGlzLmhhbmRsZVNpZ25hdHVyZVNhdmUpO1xuICB9XG5cbiAgYXN5bmMgZGVhY3RpdmF0ZSgpIHtcbiAgfVxuXG4gIGhhbmRsZVBob3RvU2F2ZSA9IGFzeW5jICh7YWNjb3VudCwgcGhvdG99KSA9PiB7XG4gICAgY29uc3QgZG93bmxvYWRVUkwgPSBBUElDbGllbnQuZ2V0UGhvdG9VUkwoYWNjb3VudCwgcGhvdG8pO1xuICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZShhY2NvdW50LCBwaG90bywgZG93bmxvYWRVUkwsIGAvcGhvdG9zLyR7cGhvdG8uaWR9LmpwZ2ApO1xuICB9XG5cbiAgaGFuZGxlVmlkZW9TYXZlID0gYXN5bmMgKHthY2NvdW50LCB2aWRlb30pID0+IHtcbiAgICBjb25zdCBkb3dubG9hZFVSTCA9IEFQSUNsaWVudC5nZXRWaWRlb1VSTChhY2NvdW50LCB2aWRlbyk7XG4gICAgYXdhaXQgdGhpcy51cGxvYWRGaWxlKGFjY291bnQsIHZpZGVvLCBkb3dubG9hZFVSTCwgYC92aWRlb3MvJHt2aWRlby5pZH0ubXA0YCk7XG4gIH1cblxuICBoYW5kbGVBdWRpb1NhdmUgPSBhc3luYyAoe2FjY291bnQsIGF1ZGlvfSkgPT4ge1xuICAgIGNvbnN0IGRvd25sb2FkVVJMID0gQVBJQ2xpZW50LmdldEF1ZGlvVVJMKGFjY291bnQsIGF1ZGlvKTtcbiAgICBhd2FpdCB0aGlzLnVwbG9hZEZpbGUoYWNjb3VudCwgYXVkaW8sIGRvd25sb2FkVVJMLCBgL2F1ZGlvLyR7YXVkaW8uaWR9Lm00YWApO1xuICB9XG5cbiAgaGFuZGxlU2lnbmF0dXJlU2F2ZSA9IGFzeW5jICh7YWNjb3VudCwgc2lnbmF0dXJlfSkgPT4ge1xuICAgIGNvbnN0IGRvd25sb2FkVVJMID0gQVBJQ2xpZW50LmdldFNpZ25hdHVyZVVSTChhY2NvdW50LCBzaWduYXR1cmUpO1xuICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZShhY2NvdW50LCBzaWduYXR1cmUsIGRvd25sb2FkVVJMLCBgL3NpZ25hdHVyZXMvJHtzaWduYXR1cmUuaWR9LnBuZ2ApO1xuICB9XG5cbiAgYXN5bmMgdXBsb2FkRmlsZShhY2NvdW50LCBtZWRpYSwgdXJsLCBuYW1lKSB7XG4gICAgY29uc3QgdGVtcEZpbGUgPSB0aGlzLnRlbXBQYXRoKG1lZGlhKTtcbiAgICBhd2FpdCBBUElDbGllbnQuZG93bmxvYWQodXJsLCB0ZW1wRmlsZSk7XG4gICAgcmV0dXJuIGRieC5maWxlc1VwbG9hZCh7cGF0aDogbmFtZSwgY29udGVudHM6IGZzLnJlYWRGaWxlU3luYyh0ZW1wRmlsZSl9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgcmltcmFmLnN5bmModGVtcEZpbGUpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9KTtcbiAgfVxufVxuIl19