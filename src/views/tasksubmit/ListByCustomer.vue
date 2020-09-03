<template>
    <div>
        <el-card>
            <el-form inline>
                <el-form-item>
                    <el-date-picker
                            v-model="form.year"
                            type="year" format="yyyy" value-format="yyyy"
                            placeholder="选择年份"
                            :editable="false" :clearable="false"
                            :picker-options="pickerOptions"
                            @change="list()"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form['chargorId']" value="" placeholder="选择负责人" @change="list()" clearable filterable>
                        <el-option v-for="i in users" :key="i.id" :value="i.id" :label="i.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form['name']" placeholder="查询单位名称" clearable @input="list()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" @click="list(true)">重 置</el-button>
                    <el-button icon="el-icon-user" type="success" @click="$router.push({name:'tasksubmit-listByChargor',params:{year:form.year}})">负责人汇总</el-button>
                    <el-button icon="el-icon-setting" type="info" @click="editTaskItem">其它填报项设置</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button circle icon="el-icon-switch-button" type="danger" @click="logout"></el-button>
                </el-form-item>
            </el-form>
            <el-alert show-icon type="warning" title="销售数据每日自动更新一次，可能与真实销售数据略有差异" style="margin-bottom: 10px"></el-alert>
            <el-alert show-icon type="warning" title="主管审核通过后 信息将不可修改" style="margin-bottom: 10px"></el-alert>
            <el-table
                    ref="table"
                    :data="records"
                    border
                    stripe
                    highlight-current-row
                    v-loading="loading"
                    @sort-change="sort"
            >
                <el-table-column prop="name" label="单位名称" sortable="custom"></el-table-column>
                <el-table-column prop="sum0" :label="`${form.year}全年销售额`" sortable="custom" align="right">
                    <template slot-scope="scope">
                        {{scope.row['sum0']}}<br/>
                        <template v-if="+scope.row['lastYearTarget']">
                            目标：{{scope.row['lastYearTarget']}}
                            <el-tooltip placement="top" effect="light" :content="`完成度：${Math.round(+scope.row['sum0']*100/+scope.row['lastYearTarget'])}%`">
                                <el-progress :text-inside="true" :stroke-width="14" :format="format" :percentage="Math.min(Math.round(+scope.row['sum0']*100/+scope.row['lastYearTarget']), 100)"></el-progress>
                            </el-tooltip>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="sum1" :label="`${+form.year-1}全年销售额`" sortable="custom" align="right"></el-table-column>
                <template v-if="thisYear">
                    <el-table-column prop="sum2" sortable="custom" align="right">
                        <template slot="header">
                            <el-tooltip placement="top" effect="light" :content="range1"><span>近12个月销售额<i class="el-icon-info"></i></span></el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sum3" sortable="custom" align="right">
                        <template slot="header">
                            <el-tooltip placement="top" effect="light" :content="range2"><span>近3个月销售额<i class="el-icon-info"></i></span></el-tooltip>
                        </template>
                    </el-table-column>
                </template>

                <el-table-column prop="target" :label="`${+form.year+1}目标销售额`" sortable="custom" align="right">
                    <template slot-scope="scope">
                        {{scope.row.target}}
                        <el-button v-if="scope.row.id" size="mini" icon="el-icon-edit" type="text" @click="show1(scope.row.id)"></el-button>
                        <br/>
                        <el-tooltip :content="thisYear ? `与近12个月销售额（${scope.row.sum2}）对比` : `与${form.year}全年销售额（${scope.row.sum0}）对比`" placement="left" effect="light">
                            <increasement-rate :nval="+scope.row.target" :oval="+scope.row.sum2"></increasement-rate>
                        </el-tooltip>
                        <small v-if="scope.row['reportor'].name">填报人：{{scope.row['reportor'].name}}</small>
                    </template>
                </el-table-column>
                <el-table-column label="其它填报项">
                    <template slot-scope="scope">
                        <div v-for="(i, j, k) in $toJSONObject(scope.row['other'])" :key="k" style="display: flex; justify-content: space-between">
                            <small>{{j}}</small><small>{{i}}</small>
                        </div>
                        <el-button style="float: right" v-if="scope.row.id" size="mini" icon="el-icon-edit" type="text" @click="show2(scope.row.id, scope.row['other'])"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if="scope.row.id">
                        <el-button type="text" @click="listByProductTag(scope.row.id)">产品填报</el-button>
<!--                        <el-button type="text">审核通过</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="total, sizes, ->, jumper, prev, pager, next"
                    :current-page.sync="form['pageNum']"
                    :page-size.sync="form['pageSize']"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                    @size-change="resize"
                    @current-change="jump"
            ></el-pagination>
        </el-card>

        <!-- 任务填报弹窗 -->
        <el-dialog :title="`填报 “${dialog1.name}” ${+form.year+1}年目标销售额`" :visible.sync="dialog1.visible">
            <el-form>
                <el-form-item>
                    <el-input-number v-model="dialog1.target" :controls="false" :precision="2" placeholder="填写目标销售额" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <increasement-rate :oval="+dialog1.sum2" :nval="+dialog1.target"></increasement-rate>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="dialog1.visible=false">取 消</el-button>
                <el-button type="primary" @click="report">保 存</el-button>
            </template>
        </el-dialog>

        <!-- 其它填报项弹窗 -->
        <el-dialog title="其它填报项" :visible.sync="dialog2.visible">
            <el-form label-width="150px">
                <el-form-item v-for="(i, j, k) in dialog2.taskItem" :key="k" :label="j">
                    <el-input v-model="dialog2.taskItem[j]"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="dialog2.visible=false">取 消</el-button>
                <el-button type="primary" @click="reportOther">保 存</el-button>
            </template>
        </el-dialog>

    </div>
</template>
<script>
    import {detail, list, report, reportOther} from "@/configs/axios/api/taskCustomerByDj";
    import {list as listTaskItem} from "@/configs/axios/api/taskItem";
    import {list as listUser, logout} from "@/configs/axios/api/user";
    import IncreasementRate from "@/components/IncreasementRate";
    import moment from "moment";
    import cons from "@/configs/global/cons";

    export default {
        components: {IncreasementRate},
        mounted() {
            this.list();
            this.listUsers();
        },
        data() {
            return {
                pickerOptions: {
                    'disabledDate'(e) {
                        return e.getTime() > Date.now();
                    }
                },
                loading: false,
                form: {
                    year: new Date().getFullYear().toString(),
                    ...this.$getLastForm()
                },
                records: [],
                users: [],
                total: 0,
                range1: [moment().add(-12, 'months').format('Y-MM-DD'), moment().format('Y-MM-DD')].join(' ~ '),
                range2: [moment().add(-3, 'months').format('Y-MM-DD'), moment().format('Y-MM-DD')].join(' ~ '),
                dialog1: {
                    target: 0,
                    visible: false,
                },
                dialog2: {
                    taskItem: {},
                    visible: false,
                },
            }
        },
        methods: {
            list(reset) {
                this.loading = true;
                if (reset) {
                    this.form = {year: new Date().getFullYear().toString()};
                    this.$refs.table.clearSort();
                    this.$keepThisForm({});
                }
                list(this.form).then(data => {
                    this.records = data['records'];
                    this.total = data['total'];
                    this.form.pageNum = data['current'];
                    this.form.pageSize = data['size'];
                    // 合计行
                    if (this.total > 0) {
                        this.records.push({
                            name: '合计',
                            sum0: data.extra.sum0,
                            sum1: data.extra.sum1,
                            sum2: data.extra.sum2,
                            sum3: data.extra.sum3,
                            target: data.extra.target,
                            lastYearTarget: data.extra.lastYearTarget,
                            reportor: ''
                        });
                    }
                }).finally(() => this.loading = false);
            },
            listUsers() {
                listUser({pageSize: cons.MAX_INTEGER_VALUE}).then(data => this.users = data.records);
            },
            jump(e) {
                this.form.pageNum = e;
                this.list();
            },
            resize(e) {
                this.form.pageSize = e;
                this.list();
            },
            sort(e) {
                this.form.orderBy = e.prop;
                this.form.asc = e.order && e.order.indexOf('asc') >= 0;
                this.form.pageNum = 1;
                this.list();
            },
            // 显示任务填报框
            show1(id) {
                detail(id).then(data => {
                    this.dialog1 = {
                        ...this.dialog1,
                        ...data
                    };
                    this.dialog1.visible = true;
                });
            },
            // 显示其他项填报框
            show2(id, other) {
                this.dialog2.visible = true;
                this.dialog2.taskItem = {};
                listTaskItem().then(data => {
                    this.dialog2.id = id;
                    data['records'].forEach(i => {
                        this.$set(this.dialog2.taskItem, i.name, '');
                    });
                    other = this.$toJSONObject(other);
                    Object.keys(other).forEach(e => {
                        this.$set(this.dialog2.taskItem, e, other[e]);
                    });
                });
            },
            listByProductTag(id) {
                this.$keepThisForm(this.form);
                this.$router.push({name: 'tasksubmit-listByProductTag', params: {taskCustomerId: id}});
            },
            report() {
                report(this.dialog1).then(() => {
                    this.dialog1.visible = false;
                    this.list();
                });
            },
            reportOther() {
                this.$set(this.dialog2, 'other', JSON.stringify(this.dialog2.taskItem));
                reportOther(this.dialog2).then(() => {
                    this.dialog2.visible = false;
                    this.list();
                });
            },
            editTaskItem() {
                this.$keepThisForm(this.form);
                this.$router.push({name: 'tasksubmit-listTaskItem'});
            },
            logout() {
                logout().then(() => this.$router.push({name: 'login'}));
            },
            format(percent) {
                return percent >= 100 ? '完成' : percent + '%';
            }
        },
        computed: {
            thisYear() {
                return +this.form.year === +new Date().getFullYear();
            }
        }
    }
</script>