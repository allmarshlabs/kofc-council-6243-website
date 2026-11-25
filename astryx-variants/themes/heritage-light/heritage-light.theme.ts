// The heritage-light theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in heritage-light.settings.json and the generated heritage-light.settings.ts;
// change them with `astryx experimental theme editor set heritage-light ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {heritageLightSettings} from './heritage-light.settings';

export const heritageLightTheme = defineTheme({
  extends: heritageLightSettings,
  name: 'heritage-light',
});
