<template>
    <div>
        <el-card>
            <el-page-header @back="this.$back" :content="`${taskCustomer.year}年 ${taskCustomer.name}（${taskCustomer.year+1}年销售目标${taskCustomer.target}）`" style="margin-bottom: 10px"></el-page-header>
            <el-form inline>
                <el-form-item>
                    <el-input v-model="form['name']" placeholder="查询产品名称" clearable @input="list()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" @click="list(true)">重 置</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    ref="table"
                    :data="records"
                    border stripe
                    highlight-current-row
                    v-loading="loading"
                    @sort-change="sort"
            >
                <el-table-column prop="name" label="产品名称" sortable="custom"></el-table-column>
                <el-table-column prop="price" label="合同平均单价" align="right" sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row['price']}}
                        <el-button v-if="scope.row.id" type="text" size="mini" @click="listAgreementSale(scope.row.name)">查看合同</el-button>
                    </template>
                </el-table-column>
                <template v-if="!thisYear">
                    <el-table-column prop="sum0" align="right" sortable="custom" :label="`${taskCustomer.year}全年销售额/量`">
                        <template slot-scope="scope">
                            <div>{{scope.row.sum2}}</div>
                            <div>{{scope.row.amount2}}</div>
                        </template>
                    </el-table-column>
                </template>
                <template v-if="thisYear">
                    <el-table-column prop="sum2" align="right" sortable="custom">
                        <template slot="header">
                            <el-tooltip placement="top" effect="light" :content="range1"><span>近12个月销售额/量<i class="el-icon-info"></i></span></el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <div>{{scope.row.sum2}}</div>
                            <div>{{scope.row.amount2}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sum3" align="right" sortable="custom">
                        <template slot="header">
                            <el-tooltip placement="top" effect="light" :content="range2"><span>近3个月销售额/量<i class="el-icon-info"></i></span></el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <div>{{scope.row.sum3}}</div>
                            <div>{{scope.row.amount3}}</div>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column prop="targetSum" :label="`${taskCustomer.year+1}目标销售额/量`" align="right" sortable="custom">
                    <template slot-scope="scope">
                        <div>{{scope.row.targetSum}}</div>
                        <div>{{scope.row.targetAmount}}</div>
                        <increasement-rate :oval="+scope.row.sum2" :nval="+scope.row.targetSum"></increasement-rate>
                    </template>
                </el-table-column>
                <el-table-column prop="totalAmount" :label="`${taskCustomer.year+1}客户总用量`" align="right" sortable="custom"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.id" type="text" @click="toReport(scope.row.id)">填报</el-button>
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

        <el-dialog :visible.sync="dialog1.visible" width="80%">
            <el-table
                    size="mini"
                    :data="dialog1.records"
                    border stripe
                    highlight-current-row
                    v-loading="dialog1.loading"
                    :sum-text="`合计 ${dialog1.records.length}条`"
                    show-summary
            >
                <el-table-column prop="agc_name" label="企业"></el-table-column>
                <el-table-column prop="cst_name" label="客户名称"></el-table-column>
                <el-table-column prop="ptg_name" label="产品分类"></el-table-column>
                <el-table-column prop="ase_name" label="合同产品名"></el-table-column>
                <el-table-column prop="ase_model_name" label="合同规格名"></el-table-column>
                <el-table-column prop="ase_unit_price" label="合同单价" align="right" sortable></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog :visible.sync="dialog2.visible">
            <el-form>
                <el-form-item :label="`${taskCustomer.year+1}年客户总用量`">
                    <el-input-number v-model="dialog2.totalAmount" :controls="false" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item :label="`${taskCustomer.year+1}年目标销售量`">
                    <el-input-number v-model="dialog2.targetAmount" :controls="false" style="width: 100%" @blur="caculateTarget"></el-input-number>
                    <increasement-rate :oval="+dialog2.amount2" :nval="+dialog2['targetAmount']"></increasement-rate>
                </el-form-item>
                <el-form-item :label="`${taskCustomer.year+1}年目标销售额`">
                    <el-input-number v-model="dialog2.targetSum" :controls="false" style="width: 100%"></el-input-number>
                    <increasement-rate :oval="+dialog2.sum2" :nval="+dialog2['targetSum']"></increasement-rate>
                </el-form-item>
            </el-form>
            <el-alert type="warning" show-icon :closable="false">
                <template slot="title">修改 "产品目标销售额" 将会重新计算 "客户单位目标销售额"，计算结果为该单位下所有 "产品目标销售额之和"</template>
            </el-alert>
            <template slot="footer">
                <el-button @click="dialog2.visible=false">取 消</el-button>
                <el-button type="primary" @click="report">保 存</el-button>
            </template>
        </el-dialog>

    </div>
</template>
<script>
    import {detail as productDetail, list, listAgreementSale, report} from "@/configs/axios/api/taskProductByDj";
    import {detail} from "@/configs/axios/api/taskCustomerByDj";
    import IncreasementRate from "@/components/IncreasementRate";
    import moment from "moment";

    export default {
        components: {IncreasementRate},
        mounted() {
            this.customerDetail();
        },
        data() {
            return {
                taskCustomer: {},
                loading: false,
                records: [],
                total: 0,
                form: {},
                dialog1: {
                    visible: false,
                    loading: false,
                    records: []
                },
                dialog2: {
                    visible: false,
                    id: null,
                    oamount: 0,
                    osum: 0,
                    targetAmount: 0,
                    targetSum: 0,
                    totalAmount: 0,
                },
                range1: [moment().add(-12, 'months').format('Y-MM-DD'), moment().format('Y-MM-DD')].join(' ~ '),
                range2: [moment().add(-3, 'months').format('Y-MM-DD'), moment().format('Y-MM-DD')].join(' ~ '),
            }
        },
        methods: {
            customerDetail() {
                detail(this.$route.params.taskCustomerId)
                    .then(data => {
                        this.taskCustomer = data;
                        this.form = {
                            year: this.taskCustomer.year,
                            customerName: this.taskCustomer.name
                        };
                        this.list();
                    });
            },
            list(reset) {
                this.loading = true;
                if (reset) {
                    this.form = {
                        year: this.taskCustomer.year,
                        customerName: this.taskCustomer.name
                    };
                    this.$refs.table.clearSort();
                }
                list(this.form).then(data => {
                    this.records = data.records;
                    this.total = data.total;
                    this.form.pageNum = data.current;
                    this.form.pageSize = data.size;
                    // 合计行
                    if (this.total > 0) {
                        this.records.push({
                            name: '合计',
                            sum0: data.extra.sum0,
                            sum1: data.extra.sum1,
                            sum2: data.extra.sum2,
                            sum3: data.extra.sum3,
                            amount0: data.extra.amount0,
                            amount1: data.extra.amount1,
                            amount2: data.extra.amount2,
                            amount3: data.extra.amount3,
                            targetSum: data.extra.targetSum,
                            targetAmount: data.extra.targetAmount,
                            totalAmount: data.extra.totalAmount,
                            reportor: ''
                        });
                    }
                }).finally(() => this.loading = false);
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
            listAgreementSale(productTagName) {
                this.dialog1.loading = true;
                this.dialog1.visible = true;
                listAgreementSale({customerName: this.taskCustomer.name, productTagName: productTagName}).then(data => {
                    this.dialog1.records = data.records;
                }).finally(() => this.dialog1.loading = false);
            },
            toReport(id) {
                this.dialog2.id = id;
                this.dialog2.visible = true;
                productDetail(id).then(data => {
                    this.dialog2 = {
                        ...this.dialog2,
                        ...data
                    }
                });
            },
            report() {
                report(this.dialog2).then(() => {
                    this.dialog2.visible = false;
                    this.list();
                    this.customerDetail();
                });
            },
            // 输入 目标销售量 自动计算 目标销售额
            caculateTarget() {
                this.dialog2.targetSum = this.dialog2.targetAmount * this.dialog2.price;
            }
        },
        computed: {
            thisYear() {
                return +this.form.year === +new Date().getFullYear();
            }
        }
    }
</script>