# V2  
V1以被满boost大佬攻破而告终，总结起来上一个阶段的问题有：  
- 进攻、防御手段不足
- 缺失多房间运营能力，发展速度慢
- 无法动态生成Creep类型
- act模块意义不大  
- 高级功能缺失，如采矿、交易、boost
- 代码拓展难度较大，超参数设置不便

下一阶段将
- 学习typescript
- 重新封装单位api，提前检查错误，以节省CPU
- 实现多房间辅助发展、多房间运营
- 开发高级功能模块
- 重构基本功能模块（学习overmind源码）
  - 重载基本API
  - WorldState模块：设置和记忆全局信息，避免重复查找
  - Config模块：超参数设置
  - CreepSpawn模块：管理Creep的生成
  - Command模块：手动控制模块
    - FlagCommand：通过Flag进行控制
  - ...
- 先顶层设计各个模块的API，再向下开发，未实现的功能也先定义好接口


# V1
## 命名
  - 类、枚举器：大驼峰，ReturnCode
  - 常量：全大写+下划线，ReturnCode.DONE
  - 实例、函数：小驼峰

## Todo
### 重构
- [ ] 原型拓展，封装原型方法，提前检查错误，防止空执行
  - [ ] Creep
    - [ ] moveTo
    - [ ] 


### old
- [x] Role模块：任务模块前期简易替代品
  - 每一个Role都是一个creep在生命周期中重复做的事情，每一个creep的role不会改变
  - 通过人数、类型、逻辑来定义role，人数不够时由spawn孵化
- [ ] Act模块：不可抢占的最小行为单位，一般为“移动去做某事”
  - [x] 基本组件
  - [x] harvest
  - [x] store
  - [x] upgrade
  - [x] build
  - [x] withdraw
  - [x] repair
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
  - [ ] Tower
    - [ ] repair
    - [ ] attack
- [x] CreepType模块：管理creep类型
- [ ] 全局信息模块：使用全局变量动态存储
  - [x] 当前拥有的所有creep
  - [x] 当前拥有的某个类型creep
  - [x] 当前地图中的资源
  - [x] 当前地图中的constructionsite
  - [ ] ...
- [ ] 事件模块：监控事件
- [ ] loop管理模块：管理每个loop例行执行的工作
  - [ ] 动态生成主函数
- [x] 记忆管理模块？
- [ ] 任务管理模块：监控事件，为单位指派行为
  - [ ] creep数量管理
- [ ] 整合模块，将小模块组装成大模块，类似CreepExtension -> Extention

## 本阶段：
- role模块
- 全局信息模块（如果cpu吃紧）
- tower
