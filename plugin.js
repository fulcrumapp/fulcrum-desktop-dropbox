import path from 'path';
import fs from 'fs';
import Dropbox from 'dropbox';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import { APIClient } from 'fulcrum';

const token = process.env.DROPBOX_ACCESS_TOKEN;

if (!token) {
  console.log('No Dropbox access token was supplied.');
  console.log('Set your token with "export DROPBOX_ACCESS_TOKEN=your_token".');
}

const dbx = new Dropbox({accessToken: token});

mkdirp.sync(path.join(__dirname, 'tmp'));

export default class {
  async task(cli) {
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
      handler: this.runCommand
    });
  }

  tempPath(media) {
    return path.join(__dirname, 'tmp', media.id);
  }

  runCommand = async () => {
    const account = await fulcrum.fetchAccount(fulcrum.args.org);

    if (account) {
      await this.activate();
    } else {
      console.error('Unable to find account', fulcrum.args.org);
    }
  }

  async activate() {
    fulcrum.on('photo:save', this.handlePhotoSave);
    fulcrum.on('video:save', this.handleVideoSave);
    fulcrum.on('audio:save', this.handleAudioSave);
    fulcrum.on('signature:save', this.handleSignatureSave);
  }

  async deactivate() {
  }

  handlePhotoSave = async ({account, photo}) => {
    const downloadURL = APIClient.getPhotoURL(account, photo);
    await this.uploadFile(account, photo, downloadURL, `/photos/${photo.id}.jpg`);
  }

  handleVideoSave = async ({account, video}) => {
    const downloadURL = APIClient.getVideoURL(account, video);
    await this.uploadFile(account, video, downloadURL, `/videos/${video.id}.mp4`);
  }

  handleAudioSave = async ({account, audio}) => {
    const downloadURL = APIClient.getAudioURL(account, audio);
    await this.uploadFile(account, audio, downloadURL, `/audio/${audio.id}.m4a`);
  }

  handleSignatureSave = async ({account, signature}) => {
    const downloadURL = APIClient.getSignatureURL(account, signature);
    await this.uploadFile(account, signature, downloadURL, `/signatures/${signature.id}.png`);
  }

  async uploadFile(account, media, url, name) {
    const tempFile = this.tempPath(media);
    await APIClient.download(url, tempFile);
    return dbx.filesUpload({path: name, contents: fs.readFileSync(tempFile)})
      .then(function (resp) {
        rimraf.sync(tempFile);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}
