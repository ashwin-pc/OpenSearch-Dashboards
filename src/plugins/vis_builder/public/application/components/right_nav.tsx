/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  EuiSuperSelect,
  EuiSuperSelectOption,
  EuiIcon,
  IconType,
  EuiConfirmModal,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import { useVisualizationType } from '../utils/use';
import './side_nav.scss';
import { useOpenSearchDashboards } from '../../../../opensearch_dashboards_react/public';
import { VisBuilderServices } from '../../types';
import {
  setActiveVisualization,
  useTypedDispatch,
  useTypedSelector,
} from '../utils/state_management';
import { getPersistedAggParams } from '../utils/use/use_persisted_agg_params';

export const RightNav = () => {
  const { ui, name: activeVisName } = useVisualizationType();
  const [newVisType, setNewVisType] = useState<string>();
  const {
    services: { types },
  } = useOpenSearchDashboards<VisBuilderServices>();
  const dispatch = useTypedDispatch();
  const StyleSection = ui.containerConfig.style.render;

  const { activeVisualization } = useTypedSelector((state) => state.visualization);
  const aggConfigParams = useMemo(() => activeVisualization?.aggConfigParams ?? [], [
    activeVisualization,
  ]);
  const persistedAggParams = useMemo(() => {
    if (!newVisType) return aggConfigParams;

    const currentVisSchemas = types.get(activeVisName)?.ui.containerConfig.data.schemas.all ?? [];
    const newVisSchemas = types.get(newVisType)?.ui.containerConfig.data.schemas.all ?? [];
    return getPersistedAggParams(aggConfigParams, newVisSchemas, currentVisSchemas);
  }, [aggConfigParams, activeVisName, newVisType, types]);

  const options: Array<EuiSuperSelectOption<string>> = types.all().map(({ name, icon, title }) => ({
    value: name,
    inputDisplay: <OptionItem icon={icon} title={title} />,
    dropdownDisplay: <OptionItem icon={icon} title={title} />,
    'data-test-subj': `visType-${name}`,
  }));

  return (
    <section className="vbSidenav right">
      <div className="vbSidenav__header">
        <EuiSuperSelect
          options={options}
          valueOfSelected={activeVisName}
          onChange={(name) => {
            setNewVisType(name);
          }}
          fullWidth
          data-test-subj="chartPicker"
        />
      </div>
      <div className="vbSidenav__style">
        <StyleSection />
      </div>
      {newVisType && (
        <EuiConfirmModal
          title={i18n.translate('visBuilder.rightNav.changeVisType.modalTitle', {
            defaultMessage: 'Change visualization type',
          })}
          confirmButtonText={i18n.translate('visBuilder.rightNav.changeVisType.confirmText', {
            defaultMessage: 'Change type',
          })}
          cancelButtonText={i18n.translate('visBuilder.rightNav.changeVisType.cancelText', {
            defaultMessage: 'Cancel',
          })}
          onCancel={() => setNewVisType(undefined)}
          onConfirm={() => {
            dispatch(
              setActiveVisualization({
                name: newVisType,
                style: types.get(newVisType)?.ui.containerConfig.style.defaults,
                aggConfigParams: persistedAggParams,
              })
            );

            setNewVisType(undefined);
          }}
          maxWidth="300px"
          data-test-subj="confirmVisChangeModal"
        >
          <p>
            <FormattedMessage
              id="visBuilder.rightNav.changeVisType.modalDescription"
              defaultMessage="Changing the visualization type will reset all field selections. Do you want to continue?"
            />
          </p>
        </EuiConfirmModal>
      )}
    </section>
  );
};

const OptionItem = ({ icon, title }: { icon: IconType; title: string }) => (
  <>
    <EuiIcon type={icon} className="vbTypeSelector__icon" />
    <span>{title}</span>
  </>
);
