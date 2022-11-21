import {
  adjectives,
  animals,
  colors,
  countries,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export const createName = () =>
  uniqueNamesGenerator({
    dictionaries: [colors, adjectives, animals],
    style: 'capital',
    separator: ' ',
  });

export const createCountryName = () =>
  uniqueNamesGenerator({
    dictionaries: [countries],
    style: 'capital',
  });

export const createNewRow = () => {
  const name = createName();
  return {
    key: name,
    name,
    country: createCountryName(),
  };
};

export const createTableData = (rowCount) =>
  Array(rowCount)
    .fill(1)
    .map(() => createNewRow());

export const removeRowFromTableData = (data = [], key) => {
  if (key) {
    const index = data.findIndex((item) => item.key === key);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }
};

export const getTableRowCount = (data = []) =>
  data.reduce(
    (count, item) =>
      item.children ? count + getTableRowCount(item.children) + 1 : count + 1,
    0
  );

export const getAllParentNodeKeys = (data = []) =>
  data.reduce(
    (list, item) =>
      item.children
        ? [...list, item.key, ...getAllParentNodeKeys(item.children)]
        : list,
    []
  );
