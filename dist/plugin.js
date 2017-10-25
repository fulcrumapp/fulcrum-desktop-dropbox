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
        yield _this.uploadFile(account, photo, downloadURL, _this.dropboxPath('photo', photo.id));
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.handleVideoSave = (() => {
      var _ref3 = _asyncToGenerator(function* ({ account, video }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getVideoURL(account, video);
        yield _this.uploadFile(account, video, downloadURL, _this.dropboxPath('video', video.id));
      });

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    })();

    this.handleAudioSave = (() => {
      var _ref4 = _asyncToGenerator(function* ({ account, audio }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getAudioURL(account, audio);
        yield _this.uploadFile(account, audio, downloadURL, _this.dropboxPath('audio', audio.id));
      });

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    })();

    this.handleSignatureSave = (() => {
      var _ref5 = _asyncToGenerator(function* ({ account, signature }) {
        const downloadURL = _fulcrumDesktopPlugin.APIClient.getSignatureURL(account, signature);
        yield _this.uploadFile(account, signature, downloadURL, _this.dropboxPath('signature', signature.id));
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
          },
          dropboxPath: {
            desc: 'dropbox path',
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

  dropboxPath(type, id) {
    const preDir = fulcrum.args.dropboxPath || '';

    const dir = {
      photo: 'photos',
      video: 'videos',
      audio: 'audio',
      signature: 'signatures'
    }[type];

    const extension = {
      photo: 'jpg',
      video: 'mp4',
      audio: 'm4a',
      signature: 'png'
    }[type];

    return `${preDir}/${dir}/${id}.${extension}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3BsdWdpbi5qcyJdLCJuYW1lcyI6WyJ0b2tlbiIsInByb2Nlc3MiLCJlbnYiLCJEUk9QQk9YX0FDQ0VTU19UT0tFTiIsImNvbnNvbGUiLCJsb2ciLCJkYngiLCJhY2Nlc3NUb2tlbiIsInN5bmMiLCJqb2luIiwiX19kaXJuYW1lIiwicnVuQ29tbWFuZCIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImFjdGl2YXRlIiwiZXJyb3IiLCJoYW5kbGVQaG90b1NhdmUiLCJwaG90byIsImRvd25sb2FkVVJMIiwiZ2V0UGhvdG9VUkwiLCJ1cGxvYWRGaWxlIiwiZHJvcGJveFBhdGgiLCJpZCIsImhhbmRsZVZpZGVvU2F2ZSIsInZpZGVvIiwiZ2V0VmlkZW9VUkwiLCJoYW5kbGVBdWRpb1NhdmUiLCJhdWRpbyIsImdldEF1ZGlvVVJMIiwiaGFuZGxlU2lnbmF0dXJlU2F2ZSIsInNpZ25hdHVyZSIsImdldFNpZ25hdHVyZVVSTCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJyZXF1aXJlZCIsInR5cGUiLCJoYW5kbGVyIiwidGVtcFBhdGgiLCJtZWRpYSIsInByZURpciIsImRpciIsImV4dGVuc2lvbiIsIm9uIiwiZGVhY3RpdmF0ZSIsInVybCIsIm5hbWUiLCJ0ZW1wRmlsZSIsImRvd25sb2FkIiwiZmlsZXNVcGxvYWQiLCJwYXRoIiwiY29udGVudHMiLCJyZWFkRmlsZVN5bmMiLCJ0aGVuIiwicmVzcCIsImNhdGNoIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLFFBQVFDLFFBQVFDLEdBQVIsQ0FBWUMsb0JBQTFCOztBQUVBLElBQUksQ0FBQ0gsS0FBTCxFQUFZO0FBQ1ZJLFVBQVFDLEdBQVIsQ0FBWSx1Q0FBWjtBQUNBRCxVQUFRQyxHQUFSLENBQVksK0RBQVo7QUFDRDs7QUFF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SCxHQUFuQixFQUF3QkUsUUFBeEIsQ0FBTjtBQUNBLGFBQU85QyxJQUFJZ0QsV0FBSixDQUFnQixFQUFDQyxNQUFNSixJQUFQLEVBQWFLLFVBQVUsYUFBR0MsWUFBSCxDQUFnQkwsUUFBaEIsQ0FBdkIsRUFBaEIsRUFDSk0sSUFESSxDQUNDLFVBQVVDLElBQVYsRUFBZ0I7QUFDcEIseUJBQU9uRCxJQUFQLENBQVk0QyxRQUFaO0FBQ0QsT0FISSxFQUlKUSxLQUpJLENBSUUsVUFBVUMsR0FBVixFQUFlO0FBQ3BCekQsZ0JBQVFDLEdBQVIsQ0FBWXdELEdBQVo7QUFDRCxPQU5JLENBQVA7QUFIMEM7QUFVM0M7QUE5RmtCLEMiLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IERyb3Bib3ggZnJvbSAnZHJvcGJveCc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgcmltcmFmIGZyb20gJ3JpbXJhZic7XG5pbXBvcnQgeyBBUElDbGllbnQgfSBmcm9tICdmdWxjcnVtJztcblxuY29uc3QgdG9rZW4gPSBwcm9jZXNzLmVudi5EUk9QQk9YX0FDQ0VTU19UT0tFTjtcblxuaWYgKCF0b2tlbikge1xuICBjb25zb2xlLmxvZygnTm8gRHJvcGJveCBhY2Nlc3MgdG9rZW4gd2FzIHN1cHBsaWVkLicpO1xuICBjb25zb2xlLmxvZygnU2V0IHlvdXIgdG9rZW4gd2l0aCBcImV4cG9ydCBEUk9QQk9YX0FDQ0VTU19UT0tFTj15b3VyX3Rva2VuXCIuJyk7XG59XG5cbmNvbnN0IGRieCA9IG5ldyBEcm9wYm94KHthY2Nlc3NUb2tlbjogdG9rZW59KTtcblxubWtkaXJwLnN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ3RtcCcpKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnZHJvcGJveCcsXG4gICAgICBkZXNjOiAnYWRkIG5ldyBwaG90b3MsIHZpZGVvcywgYXVkaW8sIGFuZCBzaWduYXR1cmVzIHRvIERyb3Bib3gnLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBvcmc6IHtcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGRyb3Bib3hQYXRoOiB7XG4gICAgICAgICAgZGVzYzogJ2Ryb3Bib3ggcGF0aCcsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgdGVtcFBhdGgobWVkaWEpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3RtcCcsIG1lZGlhLmlkKTtcbiAgfVxuXG4gIGRyb3Bib3hQYXRoKHR5cGUsIGlkKSB7XG4gICAgY29uc3QgcHJlRGlyID0gZnVsY3J1bS5hcmdzLmRyb3Bib3hQYXRoIHx8ICcnO1xuXG4gICAgY29uc3QgZGlyID0ge1xuICAgICAgcGhvdG86ICdwaG90b3MnLFxuICAgICAgdmlkZW86ICd2aWRlb3MnLFxuICAgICAgYXVkaW86ICdhdWRpbycsXG4gICAgICBzaWduYXR1cmU6ICdzaWduYXR1cmVzJ1xuICAgIH1bdHlwZV07XG5cbiAgICBjb25zdCBleHRlbnNpb24gPSB7XG4gICAgICBwaG90bzogJ2pwZycsXG4gICAgICB2aWRlbzogJ21wNCcsXG4gICAgICBhdWRpbzogJ200YScsXG4gICAgICBzaWduYXR1cmU6ICdwbmcnXG4gICAgfVt0eXBlXTtcblxuICAgIHJldHVybiBgJHtwcmVEaXJ9LyR7ZGlyfS8ke2lkfS4ke2V4dGVuc2lvbn1gO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgZnVsY3J1bS5mZXRjaEFjY291bnQoZnVsY3J1bS5hcmdzLm9yZyk7XG5cbiAgICBpZiAoYWNjb3VudCkge1xuICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVbmFibGUgdG8gZmluZCBhY2NvdW50JywgZnVsY3J1bS5hcmdzLm9yZyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWN0aXZhdGUoKSB7XG4gICAgZnVsY3J1bS5vbigncGhvdG86c2F2ZScsIHRoaXMuaGFuZGxlUGhvdG9TYXZlKTtcbiAgICBmdWxjcnVtLm9uKCd2aWRlbzpzYXZlJywgdGhpcy5oYW5kbGVWaWRlb1NhdmUpO1xuICAgIGZ1bGNydW0ub24oJ2F1ZGlvOnNhdmUnLCB0aGlzLmhhbmRsZUF1ZGlvU2F2ZSk7XG4gICAgZnVsY3J1bS5vbignc2lnbmF0dXJlOnNhdmUnLCB0aGlzLmhhbmRsZVNpZ25hdHVyZVNhdmUpO1xuICB9XG5cbiAgYXN5bmMgZGVhY3RpdmF0ZSgpIHtcbiAgfVxuXG4gIGhhbmRsZVBob3RvU2F2ZSA9IGFzeW5jICh7YWNjb3VudCwgcGhvdG99KSA9PiB7XG4gICAgY29uc3QgZG93bmxvYWRVUkwgPSBBUElDbGllbnQuZ2V0UGhvdG9VUkwoYWNjb3VudCwgcGhvdG8pO1xuICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZShhY2NvdW50LCBwaG90bywgZG93bmxvYWRVUkwsIHRoaXMuZHJvcGJveFBhdGgoJ3Bob3RvJywgcGhvdG8uaWQpKTtcbiAgfVxuXG4gIGhhbmRsZVZpZGVvU2F2ZSA9IGFzeW5jICh7YWNjb3VudCwgdmlkZW99KSA9PiB7XG4gICAgY29uc3QgZG93bmxvYWRVUkwgPSBBUElDbGllbnQuZ2V0VmlkZW9VUkwoYWNjb3VudCwgdmlkZW8pO1xuICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZShhY2NvdW50LCB2aWRlbywgZG93bmxvYWRVUkwsIHRoaXMuZHJvcGJveFBhdGgoJ3ZpZGVvJywgdmlkZW8uaWQpKTtcbiAgfVxuXG4gIGhhbmRsZUF1ZGlvU2F2ZSA9IGFzeW5jICh7YWNjb3VudCwgYXVkaW99KSA9PiB7XG4gICAgY29uc3QgZG93bmxvYWRVUkwgPSBBUElDbGllbnQuZ2V0QXVkaW9VUkwoYWNjb3VudCwgYXVkaW8pO1xuICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZShhY2NvdW50LCBhdWRpbywgZG93bmxvYWRVUkwsIHRoaXMuZHJvcGJveFBhdGgoJ2F1ZGlvJywgYXVkaW8uaWQpKTtcbiAgfVxuXG4gIGhhbmRsZVNpZ25hdHVyZVNhdmUgPSBhc3luYyAoe2FjY291bnQsIHNpZ25hdHVyZX0pID0+IHtcbiAgICBjb25zdCBkb3dubG9hZFVSTCA9IEFQSUNsaWVudC5nZXRTaWduYXR1cmVVUkwoYWNjb3VudCwgc2lnbmF0dXJlKTtcbiAgICBhd2FpdCB0aGlzLnVwbG9hZEZpbGUoYWNjb3VudCwgc2lnbmF0dXJlLCBkb3dubG9hZFVSTCwgdGhpcy5kcm9wYm94UGF0aCgnc2lnbmF0dXJlJywgc2lnbmF0dXJlLmlkKSk7XG4gIH1cblxuICBhc3luYyB1cGxvYWRGaWxlKGFjY291bnQsIG1lZGlhLCB1cmwsIG5hbWUpIHtcbiAgICBjb25zdCB0ZW1wRmlsZSA9IHRoaXMudGVtcFBhdGgobWVkaWEpO1xuICAgIGF3YWl0IEFQSUNsaWVudC5kb3dubG9hZCh1cmwsIHRlbXBGaWxlKTtcbiAgICByZXR1cm4gZGJ4LmZpbGVzVXBsb2FkKHtwYXRoOiBuYW1lLCBjb250ZW50czogZnMucmVhZEZpbGVTeW5jKHRlbXBGaWxlKX0pXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICByaW1yYWYuc3luYyh0ZW1wRmlsZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIH0pO1xuICB9XG59XG4iXX0=