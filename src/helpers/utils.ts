/**
 * Simple function to replace :param by value in URI
 *
 * @param {string} path The URI to add the values. Ex: /sheets/traffic-source-instance/campaign/:id
 * @param {object} params The Object with the values. EX: {id: 17}
 * @return string with the values. EX: /sheets/traffic-source-instance/campaign/17
 */
export const replaceParamsByValues = (
  path: string,
  params: { [s: string]: string }
) => {
  const p = typeof params === 'object' && !Array.isArray(params) ? params : {};
  const pKeys = Object.keys(p);
  let _replaceParamsByValues_output = path;

  pKeys.forEach((pKey) => {
    _replaceParamsByValues_output = _replaceParamsByValues_output.replace(
      `:${pKey}`,
      p[pKey]
    );
  });

  return _replaceParamsByValues_output;
};
