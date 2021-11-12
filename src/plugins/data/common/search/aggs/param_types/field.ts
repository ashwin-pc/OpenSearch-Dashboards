/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
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

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { i18n } from '@osd/i18n';
import { IAggConfig } from '../agg_config';
import { SavedObjectNotFound } from '../../../../../opensearch_dashboards_utils/common';
import { BaseParamType } from './base';
import { propFilter } from '../utils';
import { OSD_FIELD_TYPES } from '../../../osd_field_types/types';
import { isNestedField, IndexPatternField } from '../../../index_patterns/fields';

const filterByType = propFilter('type');

export type FieldTypes = OSD_FIELD_TYPES | OSD_FIELD_TYPES[] | '*';
// TODO need to make a more explicit interface for this
export type IFieldParamType = FieldParamType;

export class FieldParamType extends BaseParamType {
  required = true;
  scriptable = true;
  filterFieldTypes: FieldTypes;
  onlyAggregatable: boolean;

  constructor(config: Record<string, any>) {
    super(config);

    this.filterFieldTypes = config.filterFieldTypes || '*';
    this.onlyAggregatable = config.onlyAggregatable !== false;

    if (!config.write) {
      this.write = (aggConfig: IAggConfig, output: Record<string, any>) => {
        const field = aggConfig.getField();

        if (!field) {
          throw new TypeError(
            i18n.translate('data.search.aggs.paramTypes.field.requiredFieldParameterErrorMessage', {
              defaultMessage: '{fieldParameter} is a required parameter',
              values: {
                fieldParameter: '"field"',
              },
            })
          );
        }

        if (field.scripted) {
          output.params.script = {
            source: field.script,
            lang: field.lang,
          };
        } else {
          output.params.field = field.name;
        }
      };
    }

    this.serialize = (field: IndexPatternField) => {
      return field.name;
    };

    this.deserialize = (fieldName: string, aggConfig?: IAggConfig) => {
      if (!aggConfig) {
        throw new Error('aggConfig was not provided to FieldParamType deserialize function');
      }
      const field = aggConfig.getIndexPattern().fields.getByName(fieldName);

      if (!field) {
        throw new SavedObjectNotFound('index-pattern-field', fieldName);
      }

      const validField = this.getAvailableFields(aggConfig).find((f: any) => f.name === fieldName);
      if (!validField) {
        throw new Error(
          i18n.translate(
            'data.search.aggs.paramTypes.field.invalidSavedFieldParameterErrorMessage',
            {
              defaultMessage:
                'Saved field "{fieldParameter}" is invalid for use with the "{aggType}" aggregation. Please select a new field.',
              values: {
                fieldParameter: fieldName,
                aggType: aggConfig?.type?.title,
              },
            }
          )
        );
      }

      return validField;
    };
  }

  /**
   * filter the fields to the available ones
   */
  getAvailableFields = (aggConfig: IAggConfig) => {
    const fields = aggConfig.getIndexPattern().fields;
    const filteredFields = fields.filter((field: IndexPatternField) => {
      const { onlyAggregatable, scriptable, filterFieldTypes } = this;

      if (
        (onlyAggregatable && (!field.aggregatable || isNestedField(field))) ||
        (!scriptable && field.scripted)
      ) {
        return false;
      }

      return filterByType([field], filterFieldTypes).length !== 0;
    });

    return filteredFields;
  };
}
