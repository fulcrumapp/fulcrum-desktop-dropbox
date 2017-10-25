## Fulcrum Desktop Dropbox

Upload Fulcrum media files to Dropbox.

### Installation

```sh
fulcrum install-plugin --url https://github.com/fulcrumapp/fulcrum-desktop-dropbox
```

Dropbox doesn't support creating personal access tokens so you'll need to create an app in your Dropbox account. Here's a good explanation of how to do that - http://99rabbits.com/get-dropbox-access-token/.

Once you've created your Dropbox app and generated an access token, set an environment variable so the plugin can upload media on your behalf.

```sh
export DROPBOX_ACCESS_TOKEN=your_token
```

### Paths

In the step above when creating your Dropbox app, you can choose to either give this app full access to your Dropbox account or to a single directory. Your media will be uploaded to either the root of your Dropbox directory or to this app's directory depending on which option you choose.

Each media type will have its own subdirectory: `photos`, `videos`, `audio`, `signatures`.

You can optionally set the path with the `--dropbox-path` argument. This path will be relative to the Dropbox path.

Using the following command:

```sh
fulcrum sync --org "My Org" --dropbox-path '/my_org_photos'
```

The plugin will write to the `/your_dropbox_directory/my_org_photos/[photos|videos|audio|signatures]` directories.
