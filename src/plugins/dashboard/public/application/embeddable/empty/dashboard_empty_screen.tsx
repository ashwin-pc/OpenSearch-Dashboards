/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { I18nProvider } from '@osd/i18n/react';
import {
  EuiLink,
  EuiSpacer,
  EuiPageContent,
  EuiPageBody,
  EuiPage,
  EuiImage,
  EuiText,
  EuiButton,
} from '@elastic/eui';
import { IUiSettingsClient, HttpStart } from 'opensearch-dashboards/public';
import * as constants from './dashboard_empty_screen_constants';

export interface DashboardEmptyScreenProps {
  showLinkToVisualize: boolean;
  onLinkClick: () => void;
  onVisualizeClick?: () => void;
  uiSettings: IUiSettingsClient;
  http: HttpStart;
  isReadonlyMode?: boolean;
}

export function DashboardEmptyScreen({
  showLinkToVisualize,
  onLinkClick,
  onVisualizeClick,
  uiSettings,
  http,
  isReadonlyMode,
}: DashboardEmptyScreenProps) {
  const IS_DARK_THEME = uiSettings.get('theme:darkMode');
  const emptyStateGraphicURL = IS_DARK_THEME
    ? '/plugins/home/assets/welcome_graphic_dark_2x.png'
    : '/plugins/home/assets/welcome_graphic_light_2x.png';
  const linkToVisualizeParagraph = (
    <p data-test-subj="linkToVisualizeParagraph">
      <EuiButton
        iconSide="left"
        size="s"
        iconType="plusInCircle"
        onClick={onVisualizeClick}
        data-test-subj="addVisualizationButton"
        aria-label={constants.createNewVisualizationButtonAriaLabel}
      >
        {constants.createNewVisualizationButton}
      </EuiButton>
    </p>
  );
  const paragraph = (
    description1: string | null,
    description2: string,
    linkText: string,
    ariaLabel: string,
    dataTestSubj?: string
  ) => {
    return (
      <EuiText size="s" color="subdued">
        <p>
          {description1}
          {description1 && <span>&nbsp;</span>}
          <EuiLink onClick={onLinkClick} aria-label={ariaLabel} data-test-subj={dataTestSubj || ''}>
            {linkText}
          </EuiLink>
          <span>&nbsp;</span>
          {description2}
        </p>
      </EuiText>
    );
  };
  const enterEditModeParagraph = paragraph(
    constants.howToStartWorkingOnNewDashboardDescription1,
    constants.howToStartWorkingOnNewDashboardDescription2,
    constants.howToStartWorkingOnNewDashboardEditLinkText,
    constants.howToStartWorkingOnNewDashboardEditLinkAriaLabel
  );
  const enterViewModeParagraph = paragraph(
    null,
    constants.addNewVisualizationDescription,
    constants.addExistingVisualizationLinkText,
    constants.addExistingVisualizationLinkAriaLabel
  );
  const page = (mainText: string, showAdditionalParagraph?: boolean, additionalText?: string) => {
    return (
      <EuiPage className="dshStartScreen" restrictWidth="500px">
        <EuiPageBody component="main">
          <EuiPageContent
            verticalPosition="center"
            horizontalPosition="center"
            paddingSize="none"
            className="dshStartScreen__pageContent"
          >
            <EuiImage url={http.basePath.prepend(emptyStateGraphicURL)} alt="" />
            <EuiText size="s">
              <p style={{ fontWeight: 'bold' }}>{mainText}</p>
            </EuiText>
            {additionalText ? (
              <EuiText size="s" color="subdued">
                {additionalText}
              </EuiText>
            ) : null}
            {showAdditionalParagraph ? (
              <React.Fragment>
                <EuiSpacer size="m" />
                <div className="dshStartScreen__panelDesc">{enterEditModeParagraph}</div>
              </React.Fragment>
            ) : null}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  };
  const readonlyMode = page(
    constants.emptyDashboardTitle,
    false,
    constants.emptyDashboardAdditionalPrivilege
  );
  const viewMode = page(constants.fillDashboardTitle, true);
  const editMode = (
    <div data-test-subj="emptyDashboardWidget" className="dshEmptyWidget">
      {enterViewModeParagraph}
      <EuiSpacer size="l" />
      {linkToVisualizeParagraph}
    </div>
  );
  const actionableMode = showLinkToVisualize ? editMode : viewMode;
  return <I18nProvider>{isReadonlyMode ? readonlyMode : actionableMode}</I18nProvider>;
}
