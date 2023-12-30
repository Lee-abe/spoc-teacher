/*
 * @Author: 王大旭
 * @Date: 2023-04-24 18:56:13
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-05-04 11:42:28
 * @Description:
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-case": [2, "always", ["lower-case", "upper-case"]],
    "type-enum": [
      2,
      "always",
      [
        "workflow",
        "ci",
        "wip",
        "types",
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert",
        "build"
      ]
    ]
  }
}
