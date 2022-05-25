## 命名
  - 类、枚举器：大驼峰，ReturnCode
  - 常量：全大写+下划线，ReturnCode.DONE
  - 实例、函数：小驼峰

## Todo
- [ ] Act模块：不可抢占的最小行为单位，一般为“移动去做某事”
  - [x] 基本组件
  - [x] harvest
  - [x] store
  - [x] upgrade
  - [x] build
  - [x] withdraw
  - [ ] repair
  - [ ] attack
  - [ ] pull
  - [ ] ...
- [ ] Task模块：一系列act组成一个task，task之间有抢占机制
  - [x] 基本组件
  - [x] HarvestToStore
  - [ ] 抢占机制
- [ ] 原型拓展模块：拓展原型的基本方法
  - [ ] Creep
    - [x] log
    - [x] 移动到某位置的某个范围内
  - [ ] Spawn
    - [x] log
    - [x] 通过CreepType孵化creep
- [x] CreepType模块：管理creep类型
- [ ] 全局信息模块：使用全局变量动态存储
  - [ ] 当前拥有的所有creep
  - [ ] 当前拥有的某个类型creep
  - [ ] 当前地图中的资源
  - [ ] 当前地图中的constructionsite
  - [ ] ...
- [ ] 事件模块：监控事件
- [ ] loop管理模块：管理每个loop例行执行的工作
  - [ ] 动态生成主函数
- [ ] 记忆管理模块？
- [ ] 任务管理模块：监控事件，为单位指派行为
  - [ ] creep数量管理


