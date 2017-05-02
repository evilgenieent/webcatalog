import { ipcRenderer } from 'electron';
import { Toaster, Position, Intent } from '@blueprintjs/core';
import semver from 'semver';
import { version as currentVersion } from '../../../../package.json';

import customFetch from '../libs/customFetch';

const showUpdateToast = () =>
  customFetch('https://api.github.com/repos/webcatalog/webcatalog/releases/latest')
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    })
    .then(response => response.json())
    .then(({ tag_name }) => {
      const latestVersion = tag_name.substring(1);

      if (semver.gte(currentVersion, latestVersion)) return;

      const toaster = Toaster.create({
        position: Position.BOTTOM_LEFT,
      });
      toaster.show({
        intent: Intent.SUCCESS,
        message: `An update (${latestVersion}) is now available.`,
        timeout: 0,
        action: {
          onClick: () => ipcRenderer.send('open-in-browser', 'https://getwebcatalog.com'),
          text: 'Download',
        },
      });
    });

export default showUpdateToast;
