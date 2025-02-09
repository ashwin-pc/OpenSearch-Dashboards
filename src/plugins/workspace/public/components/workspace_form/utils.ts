/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';

import type { SavedObjectPermissions } from '../../../../../core/types';
import { DEFAULT_SELECTED_FEATURES_IDS, WorkspacePermissionMode } from '../../../common/constants';
import { isUseCaseFeatureConfig } from '../../utils';
import {
  optionIdToWorkspacePermissionModesMap,
  PermissionModeId,
  WorkspacePermissionItemType,
} from './constants';

import { WorkspaceFormErrors, WorkspaceFormSubmitData, WorkspacePermissionSetting } from './types';
import { DataSource } from '../../../common/types';

export const appendDefaultFeatureIds = (ids: string[]) => {
  // concat default checked ids and unique the result
  return Array.from(new Set(ids.concat(DEFAULT_SELECTED_FEATURES_IDS)));
};

export const isValidFormTextInput = (input?: string) => {
  /**
   * This regular expression is from the workspace form name and description field UI.
   * It only accepts below characters.
   **/
  const regex = /^[0-9a-zA-Z()_\[\]\-\s]+$/;
  return typeof input === 'string' && regex.test(input);
};

export const getNumberOfErrors = (formErrors: WorkspaceFormErrors) => {
  let numberOfErrors = 0;
  if (formErrors.name) {
    numberOfErrors += 1;
  }
  if (formErrors.description) {
    numberOfErrors += 1;
  }
  if (formErrors.permissionSettings) {
    numberOfErrors += Object.keys(formErrors.permissionSettings).length;
  }
  if (formErrors.selectedDataSources) {
    numberOfErrors += Object.keys(formErrors.selectedDataSources).length;
  }
  if (formErrors.features) {
    numberOfErrors += 1;
  }
  return numberOfErrors;
};

export const isUserOrGroupPermissionSettingDuplicated = (
  permissionSettings: Array<Partial<WorkspacePermissionSetting>>,
  permissionSettingToCheck: WorkspacePermissionSetting
) =>
  permissionSettings.some(
    (permissionSetting) =>
      (permissionSettingToCheck.type === WorkspacePermissionItemType.User &&
        permissionSetting.type === WorkspacePermissionItemType.User &&
        permissionSettingToCheck.userId === permissionSetting.userId) ||
      (permissionSettingToCheck.type === WorkspacePermissionItemType.Group &&
        permissionSetting.type === WorkspacePermissionItemType.Group &&
        permissionSettingToCheck.group === permissionSetting.group)
  );

/**
 * This function is for converting passed permission modes to permission option id,
 * it will return Read as default if permission modes not matched.
 *
 * @param modes permission modes
 * @returns permission option id
 */
export const getPermissionModeId = (modes: WorkspacePermissionMode[]) => {
  for (const key in optionIdToWorkspacePermissionModesMap) {
    if (optionIdToWorkspacePermissionModesMap[key].every((mode) => modes?.includes(mode))) {
      return key;
    }
  }
  return PermissionModeId.Read;
};

export const convertPermissionSettingsToPermissions = (
  permissionItems: WorkspacePermissionSetting[] | undefined
) => {
  if (!permissionItems || permissionItems.length === 0) {
    return undefined;
  }
  return permissionItems.reduce<SavedObjectPermissions>((previous, current) => {
    current.modes.forEach((mode) => {
      if (!previous[mode]) {
        previous[mode] = {};
      }
      switch (current.type) {
        case WorkspacePermissionItemType.User:
          previous[mode].users = previous[mode].users?.includes(current.userId)
            ? previous[mode].users
            : [...(previous[mode].users || []), current.userId];
          break;
        case WorkspacePermissionItemType.Group:
          previous[mode].groups = previous[mode].groups?.includes(current.group)
            ? previous[mode].groups
            : [...(previous[mode].groups || []), current.group];
          break;
      }
    });
    return previous;
  }, {});
};

const isWorkspacePermissionMode = (test: string): test is WorkspacePermissionMode =>
  test === WorkspacePermissionMode.LibraryRead ||
  test === WorkspacePermissionMode.LibraryWrite ||
  test === WorkspacePermissionMode.Read ||
  test === WorkspacePermissionMode.Write;

export const convertPermissionsToPermissionSettings = (permissions: SavedObjectPermissions) => {
  const permissionSettings: WorkspacePermissionSetting[] = [];
  const finalPermissionSettings: WorkspacePermissionSetting[] = [];
  const settingType2Modes: { [key: string]: WorkspacePermissionMode[] } = {};

  const processUsersOrGroups = (
    usersOrGroups: string[] | undefined,
    type: WorkspacePermissionItemType,
    mode: WorkspacePermissionMode
  ) => {
    usersOrGroups?.forEach((userOrGroup) => {
      const settingTypeKey = `${type}-${userOrGroup}`;
      const modes = settingType2Modes[settingTypeKey] ?? [];

      modes.push(mode);
      if (modes.length === 1) {
        permissionSettings.push({
          // This id is for type safe, and will be overwrite in below.
          id: 0,
          modes,
          ...(type === WorkspacePermissionItemType.User
            ? { type: WorkspacePermissionItemType.User, userId: userOrGroup }
            : { type: WorkspacePermissionItemType.Group, group: userOrGroup }),
        });
        settingType2Modes[settingTypeKey] = modes;
      }
    });
  };

  Object.keys(permissions).forEach((mode) => {
    if (isWorkspacePermissionMode(mode)) {
      processUsersOrGroups(permissions[mode].users, WorkspacePermissionItemType.User, mode);
      processUsersOrGroups(permissions[mode].groups, WorkspacePermissionItemType.Group, mode);
    }
  });

  let id = 0;
  /**
   * One workspace permission setting may include multi setting options,
   * for loop the workspace permission setting array to separate it to multi rows.
   **/
  permissionSettings.forEach((currentPermissionSettings) => {
    /**
     * For loop the option id to workspace permission modes map,
     * if one settings includes all permission modes in a specific option,
     * add these permission modes to the result array.
     */
    for (const key in optionIdToWorkspacePermissionModesMap) {
      if (!Object.prototype.hasOwnProperty.call(optionIdToWorkspacePermissionModesMap, key)) {
        continue;
      }
      const modesForCertainPermissionId = optionIdToWorkspacePermissionModesMap[key];
      if (
        modesForCertainPermissionId.every((mode) => currentPermissionSettings.modes?.includes(mode))
      ) {
        finalPermissionSettings.push({
          ...currentPermissionSettings,
          id,
          modes: modesForCertainPermissionId,
        });
        id++;
      }
    }
  });

  return finalPermissionSettings;
};

export const isSelectedDataSourcesDuplicated = (
  selectedDataSources: DataSource[],
  row: DataSource
) => selectedDataSources.some((ds) => ds.id === row.id);

export const validateWorkspaceForm = (
  formData: Omit<Partial<WorkspaceFormSubmitData>, 'permissionSettings'> & {
    permissionSettings?: Array<
      Pick<WorkspacePermissionSetting, 'id'> & Partial<WorkspacePermissionSetting>
    >;
  }
) => {
  const formErrors: WorkspaceFormErrors = {};
  const { name, permissionSettings, features, selectedDataSources } = formData;
  if (name) {
    if (!isValidFormTextInput(name)) {
      formErrors.name = i18n.translate('workspace.form.detail.name.invalid', {
        defaultMessage: 'Invalid workspace name',
      });
    }
  } else {
    formErrors.name = i18n.translate('workspace.form.detail.name.empty', {
      defaultMessage: "Name can't be empty.",
    });
  }
  if (!features || !features.some((featureConfig) => isUseCaseFeatureConfig(featureConfig))) {
    formErrors.features = i18n.translate('workspace.form.features.empty', {
      defaultMessage: 'Use case is required. Select a use case.',
    });
  }
  if (permissionSettings) {
    const permissionSettingsErrors: { [key: number]: string } = {};
    for (let i = 0; i < permissionSettings.length; i++) {
      const setting = permissionSettings[i];
      if (!setting.type) {
        permissionSettingsErrors[setting.id] = i18n.translate(
          'workspace.form.permission.invalidate.type',
          {
            defaultMessage: 'Invalid type',
          }
        );
      } else if (!setting.modes || setting.modes.length === 0) {
        permissionSettingsErrors[setting.id] = i18n.translate(
          'workspace.form.permission.invalidate.modes',
          {
            defaultMessage: 'Invalid permission modes',
          }
        );
      } else if (setting.type === WorkspacePermissionItemType.User && !setting.userId) {
        permissionSettingsErrors[setting.id] = i18n.translate(
          'workspace.form.permission.invalidate.userId',
          {
            defaultMessage: 'Invalid user id',
          }
        );
      } else if (setting.type === WorkspacePermissionItemType.Group && !setting.group) {
        permissionSettingsErrors[setting.id] = i18n.translate(
          'workspace.form.permission.invalidate.group',
          {
            defaultMessage: 'Invalid user group',
          }
        );
      } else if (
        isUserOrGroupPermissionSettingDuplicated(
          permissionSettings.slice(0, i),
          setting as WorkspacePermissionSetting
        )
      ) {
        permissionSettingsErrors[setting.id] = i18n.translate(
          'workspace.form.permission.invalidate.group',
          {
            defaultMessage: 'Duplicate permission setting',
          }
        );
      }
    }
    if (Object.keys(permissionSettingsErrors).length > 0) {
      formErrors.permissionSettings = permissionSettingsErrors;
    }
  }
  if (selectedDataSources) {
    const dataSourcesErrors: { [key: number]: string } = {};
    for (let i = 0; i < selectedDataSources.length; i++) {
      const row = selectedDataSources[i];
      if (!row.id) {
        dataSourcesErrors[i] = i18n.translate('workspace.form.dataSource.invalid', {
          defaultMessage: 'Invalid data source',
        });
      } else if (isSelectedDataSourcesDuplicated(selectedDataSources.slice(0, i), row)) {
        dataSourcesErrors[i] = i18n.translate('workspace.form.permission.invalidate.group', {
          defaultMessage: 'Duplicate data sources',
        });
      }
    }
    if (Object.keys(dataSourcesErrors).length > 0) {
      formErrors.selectedDataSources = dataSourcesErrors;
    }
  }
  return formErrors;
};

export const generateNextPermissionSettingsId = (permissionSettings: Array<{ id: number }>) => {
  return permissionSettings.length === 0
    ? 0
    : Math.max(...permissionSettings.map(({ id }) => id)) + 1;
};
