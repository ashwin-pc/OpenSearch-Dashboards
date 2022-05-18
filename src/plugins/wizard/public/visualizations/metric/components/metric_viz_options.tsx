/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import { i18n } from '@osd/i18n';
import { EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import { FormattedMessage } from 'react-intl';
import {
  ColorRanges,
  RangeOption,
  SetColorRangeValue,
  SwitchOption,
} from '../../../../../charts/public';
import { useTypedSelector } from '../../../application/utils/state_management';

function MetricVizOptions() {
  const { style } = useTypedSelector((state) => state);
  const { metric } = style;

  const setMetric = useCallback((key: string) => {
    // console.log('key', key);

    return () => {};
  }, []);

  if (!metric) return <div>Loading...</div>;

  return (
    <>
      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h3>
            <FormattedMessage id="visTypeMetric.params.settingsTitle" defaultMessage="Settings" />
          </h3>
        </EuiTitle>
        <EuiSpacer size="s" />

        <SwitchOption
          label={i18n.translate('visTypeMetric.params.percentageModeLabel', {
            defaultMessage: 'Percentage mode',
          })}
          paramName="percentageMode"
          value={metric.percentageMode}
          setValue={setMetric('value')}
        />

        <SwitchOption
          label={i18n.translate('visTypeMetric.params.showTitleLabel', {
            defaultMessage: 'Show title',
          })}
          paramName="show"
          value={metric.labels.show}
          setValue={setMetric('labels')}
        />
      </EuiPanel>

      <EuiSpacer size="s" />

      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h3>
            <FormattedMessage id="visTypeMetric.params.rangesTitle" defaultMessage="Ranges" />
          </h3>
        </EuiTitle>
        <EuiSpacer size="s" />

        <ColorRanges
          data-test-subj="metricColorRange"
          colorsRange={metric.colorsRange}
          setValue={setMetric('labels') as SetColorRangeValue}
          setTouched={setMetric('touched')}
          setValidity={setMetric('validity')}
        />

        {/* <EuiFormRow fullWidth display="rowCompressed" label={metricColorModeLabel}>
          <EuiButtonGroup
            buttonSize="compressed"
            idSelected={metric.metricColorMode}
            isDisabled={metric.colorsRange.length === 1}
            isFullWidth={true}
            legend={metricColorModeLabel}
            options={vis.type.editorConfig.collections.metricColorMode}
            onChange={setColorMode}
          />
        </EuiFormRow> */}

        {/* <ColorSchemaOptions
          colorSchema={metric.colorSchema}
          colorSchemas={vis.type.editorConfig.collections.colorSchemas}
          disabled={
            metric.colorsRange.length === 1 ||
            metric.metricColorMode === ColorModes.NONE
          }
          invertColors={metric.invertColors}
          setValue={setMetricValue as SetColorSchemaOptionsValue}
          showHelpText={false}
          uiState={uiState}
        /> */}
      </EuiPanel>

      <EuiSpacer size="s" />

      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h3>
            <FormattedMessage id="visTypeMetric.params.style.styleTitle" defaultMessage="Style" />
          </h3>
        </EuiTitle>
        <EuiSpacer size="s" />

        <RangeOption
          label={i18n.translate('visTypeMetric.params.style.fontSizeLabel', {
            defaultMessage: 'Metric font size in points',
          })}
          min={12}
          max={120}
          paramName="fontSize"
          value={metric.style.fontSize}
          setValue={setMetric('style')}
          showInput={true}
          showLabels={true}
          showValue={false}
        />
      </EuiPanel>
    </>
  );
}

export { MetricVizOptions };
