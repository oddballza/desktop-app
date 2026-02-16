import { BrowserXThemeProvider } from '@getstation/theme';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Subject } from 'rxjs';

// tslint:disable-next-line:no-import-side-effect
import '../../../theme/css/app.global.css';
import { getSearchParams } from '../../../webui/helpers';
import { WebUIGradientProvider } from '../../../webui/WebUIGradientProvider';
import MultiInstanceConfigurator from './MultiInstanceConfigurator';

const params = getSearchParams();
const manifestURL = params.get('manifestURL')!;
const applicationId = params.get('applicationId')!;

const themeColorsObservable = new Subject<any>();
window.bxApi.theme.addThemeColorsChangeListener(
  (_: any, result: any) => themeColorsObservable.next(result)
);

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

createRoot(container).render(
  <BrowserXThemeProvider>
    <WebUIGradientProvider themeColorsObservable={themeColorsObservable}>
      <MultiInstanceConfigurator
        applicationId={applicationId}
        manifestURL={manifestURL}
      />
    </WebUIGradientProvider>
  </BrowserXThemeProvider>
);
