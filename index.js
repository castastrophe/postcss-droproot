/*
Copyright 2023. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/** @type import('postcss-values-parser') */
const { parse, nodeToString } = require('postcss-values-parser');

/** @type import('postcss').PluginCreator */
module.exports = ({
  withFallbacks = false,
}) => {
  return {
    postcssPlugin: 'postcss-droproot',
    prepare() {
      const rootDefinitions = new Map();
      return {
        Declaration(decl, { result }) {
          const selector = decl.parent.selector;
          if (!withFallbacks || selector !== ':root') return;
          // If this is a :root selector, capture fallback values
          if (decl.prop.startsWith('--')) {
            // Add the fallback value to the map, we always want to keep the last value
            rootDefinitions.set(decl.prop, decl.value);
            return;
          }

          // @todo: If this is not a custom property, how do we want to handle it?
          decl.warn(result, 'Only custom properties can be preserved from :root', {
            word: decl.prop,
          });
        },
        RuleExit(rule) {
          const selector = rule.selector;

          if (selector !== ':root') return;
          rule.remove();
        },
        DeclarationExit(decl) {
          if (!withFallbacks) return;

          let shouldUpdate = false;

          // On exit, if the selector is not root, check if it needs any fallbacks added
          // If the value does not include a custom property, we don't need to add a fallback
          const updates = parse(decl.value).nodes?.map((node) => {
            if (!node.isVar) return node;

            const [customProperty, , fallback] = node.nodes;

            if (
              (fallback && fallback.type === 'word') ||
              !customProperty ||
              !customProperty.value ||
              !rootDefinitions.has(customProperty.value)
            ) {
              return node;
            }

            const fallbackValue = rootDefinitions.get(customProperty.value);

            // Update the node to include the original custom property with the found fallback value
            node.nodes.push(
              { type: 'punctuation', value: ',', raws: { before: '' } },
              { type: 'word', value: fallbackValue, raws: { before: ' ' } },
            );

            shouldUpdate = true;
            return node;
          });

          // If any changes were made, we update the declaration
          if (!shouldUpdate) return;

          decl.value = updates.map(nodeToString).join(' ');
        },
      };
    },
  };
};
