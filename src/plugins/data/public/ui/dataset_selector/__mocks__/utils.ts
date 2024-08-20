/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Dataset,
  DatasetManager,
  DatasetTypeConfig,
  DataSource,
  DataStructure,
} from '../../../../common/data_sets';

interface DatasetVariations {
  dataSourceTypes: string[];
  dataSetTypes: string[];
  timeFields: string[];
}

export function generateRandomDatasets(count: number, variations: DatasetVariations): Dataset[] {
  const datasets: Dataset[] = [];

  for (let i = 0; i < count; i++) {
    const dataSource: DataSource = {
      id: `ds-${Math.random().toString(36).substr(2, 9)}`,
      title: `Data Source ${i + 1}`,
      type:
        variations.dataSourceTypes[Math.floor(Math.random() * variations.dataSourceTypes.length)],
    };

    const dataset: Dataset = {
      id: `dataset-${Math.random().toString(36).substr(2, 9)}`,
      title: `Dataset ${i + 1}`,
      type: variations.dataSetTypes[Math.floor(Math.random() * variations.dataSetTypes.length)],
      timeFieldName:
        variations.timeFields[Math.floor(Math.random() * variations.timeFields.length)],
      dataSource,
    };

    datasets.push(dataset);
  }

  return datasets;
}

class MockDatasetManager implements DatasetManager {
  private types: {
    [key: string]: DatasetTypeConfig;
  } = {};

  private dataset?: Dataset;
  private recentDatasets: Dataset[] = [];

  constructor() {
    this.registerType({
      id: 'index-pattern',
      title: 'Index Pattern',
      getOptions: this.mockGetIndexPatternOptions,
      getDataset: this.mockGetIndexPatternDataset,
      getFields: this.mockGetIndexPatternFields,
      config: {
        supportedLanguages: ['DQL', 'lucene'],
        icon: {
          type: 'indexPatternApp',
        },
      },
    });

    this.registerType({
      id: 'index',
      title: 'Indices',
      getOptions: this.mockGetIndicesOptions,
      getDataset: this.mockGetIndicesDataset,
      getFields: this.mockGetIndicesFields,
      config: {
        supportedLanguages: ['DQL', 'lucene'],
        icon: {
          type: 'logoOpenSearch',
        },
        hasTimeField: true,
      },
    });
  }

  registerType = (props: DatasetTypeConfig) => {
    this.types[props.id] = props;
  };

  getTypes = () => {
    return Object.values(this.types);
  };

  getType = (type: string) => {
    return this.types[type];
  };

  getDataSet = () => {
    return this.dataset;
  };

  setDataSet = (dataset: Dataset) => {
    this.dataset = dataset;
    // Store the top 10 recently used
    this.recentDatasets = [dataset, ...this.recentDatasets].slice(0, 10);
  };

  getRecentlyUsed = () => {
    return this.recentDatasets;
  };

  private mockGetIndexPatternOptions = async (path?: DataStructure[]) => {
    const lastOption = path?.[path.length - 1];

    if (lastOption?.id !== 'index-pattern') {
      return {
        options: [],
        columnHeader: 'Index patterns',
      };
    }
    const mockData: DataStructure[] = [
      { id: 'pattern1', title: 'logs-*', type: 'index-pattern' },
      { id: 'pattern2', title: 'metrics-*', type: 'index-pattern' },
      { id: 'pattern3', title: 'events-*', type: 'index-pattern' },
    ];

    return {
      options: mockData,
      columnHeader: 'Index patterns',
    };
  };

  private mockGetIndexPatternDataset = (path: DataStructure[]) => {
    const lastOption = path?.[path.length - 1];

    return {
      id: lastOption?.id,
      title: lastOption?.title,
      type: 'index-pattern',
      timeFieldName: 'timestamp',
      dataSource: {
        id: 'main-cluster',
        title: 'Main OpenSearch Cluster',
        type: 'OPENSEARCH',
      },
    };
  };

  private mockGetIndexPatternFields = async (dataset: Dataset) => {
    return [
      {
        name: 'timestamp',
        type: 'date',
      },
      {
        name: 'bytes',
        type: 'number',
      },
      {
        name: 'cpu',
        type: 'number',
      },
      {
        name: 'memory',
        type: 'number',
      },
      {
        name: 'log',
        type: 'string',
      },
    ];
  };

  private mockGetIndicesOptions = async (path?: DataStructure[]) => {
    const option = path?.[path.length - 1];
    if (option?.type === 'index') {
      // First level: List of clusters
      const mockClusters: DataStructure[] = [
        { id: 'cluster1', title: 'Production Cluster', type: 'cluster' },
        { id: 'cluster2', title: 'Development Cluster', type: 'cluster' },
        { id: 'cluster3', title: 'Testing Cluster', type: 'cluster' },
      ];

      return {
        options: mockClusters,
        isLoadable: true,
        columnHeader: 'Clusters',
      };
    } else if (option?.type === 'cluster') {
      // Second level: List of indices within the selected cluster
      const mockIndices: DataStructure[] = [
        { id: `${option.id}-index1`, title: `${option.title}-logs-2023.05`, type: 'index' },
        { id: `${option.id}-index2`, title: `${option.title}-metrics-2023.05`, type: 'index' },
        { id: `${option.id}-index3`, title: `${option.title}-events-2023.05`, type: 'index' },
      ];

      return {
        options: mockIndices,
        columnHeader: 'Indices',
      };
    }

    // If we reach here, it's an unexpected state
    return {
      options: [],
      columnHeader: 'Indices',
    };
  };

  private mockGetIndicesDataset = (path: DataStructure[]) => {
    const option = path?.[path.length - 1];

    return {
      id: option?.id,
      title: option?.title,
      type: 'index',
      timeFieldName: 'timestamp',
      dataSource: {
        id: 'main-cluster',
        title: 'Main OpenSearch Cluster',
        type: 'OPENSEARCH',
      },
    };
  };

  private mockGetIndicesFields = async (dataset: Dataset) => {
    return [
      {
        name: 'timestamp',
        type: 'date',
      },
      {
        name: 'bytes',
        type: 'number',
      },
      {
        name: 'cpu',
        type: 'number',
      },
      {
        name: 'memory',
        type: 'number',
      },
      {
        name: 'log',
        type: 'string',
      },
    ];
  };
}

// Export an instance of the mock manager
export const mockDatasetManager = new MockDatasetManager();
