
var mOrganizationId = "";
var mWorkingSectionID = "";
var mProductionName = "";
var mProductionID = "";
//var mStaffId = "";
var mStartTime = "";
var mEndTime = "";
var mGroupId = "";
var mStatisticalCycle = "";
//var mAssessmentCycle = "";
$(document).ready(function () {
    InitialDate("month");
    LoadAssessmentGroupGrid();
    LoadMainDataGrid("first");
});
function LoadAssessmentGroupGrid() {
    $.ajax({
        type: "POST",
        url: "StaffAssessmentRanking.aspx/GetAssessmentGroupGrid",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#AssessmentGroup').combogrid({
                panelWidth: '138px',
                panelHeight: 'auto',
                idField: 'GroupId',
                textField: 'Name',
                columns: [[
                    { field: 'GroupId', title: '', width: 40, hidden: true },
                    { field: 'Name', title: '考核分组', width: 60 },
                    {
                        field: 'StatisticalCycle', title: '考核周期', align: 'center', width: 75, formatter: function (value, row, index) {
                            if (value == "day") {
                                return value = "日";
                            } else if (value == "month") {
                                return value = "月";
                            } else if (value == "year") {
                                return value = "年";
                            }
                        }
                    }
                ]],
                data: myData,
                onSelect: function (index, row) {
                    mGroupId = row.GroupId;
                    mStatisticalCycle = row.StatisticalCycle;
                    InitialDate(mStatisticalCycle);
                    if (mStatisticalCycle == "day") {
                         mAssessmentCycle = "日";
                    } else if (mStatisticalCycle == "month") {
                         mAssessmentCycle = "月";
                    } else if (mStatisticalCycle == "year") {
                         mAssessmentCycle = "年";
                    }
                    // $("#AssessmentCycle").val(mAssessmentCycle);
                  //  $('#AssessmentCycle').textbox('setValue', "月");
                    $('#AssessmentCycle').textbox('setText', mAssessmentCycle);
                    //mProductionName = row.OrganizationName;
                    //$('#productionName').textbox('setText', mProductionName);
                    //mProductionID = row.OrganizationID;
                    //LoadStaffInfo(mProductionID, mWorkingSectionID);
                }
            });
        },
        error: function () {
            // $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });

}
function onOrganisationTreeClick(node) {
    $('#organizationName').textbox('setText', node.text);
    mOrganizationId = node.OrganizationId;
    // LoadStaffInfo(mOrganizationId);
    LoadWorkingSectionGrid(mOrganizationId);
}
function LoadWorkingSectionGrid(mValue) {
    $.ajax({
        type: "POST",
        url: "StaffAssessment.aspx/GetWorkingSectionGrid",
        data: " {mOrganizationId:'" + mValue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#workingSection').combogrid({
                panelWidth: '182px',
                panelHeight: 'auto',
                idField: 'WorkingSectionID',
                textField: 'WorkingSectionName',
                columns: [[
                    { field: 'WorkingSectionID', title: '', width: 60, hidden: true },
                    { field: 'WorkingSectionName', title: '岗位名称', width: 80 },
                    { field: 'OrganizationName', title: '产线', width: 100 }
                ]],
                data: myData,
                onSelect: function (index, row) {
                    mWorkingSectionID = row.WorkingSectionID;
                    mProductionName = row.OrganizationName;
                    $('#productionName').textbox('setText', mProductionName);
                    mProductionID = row.OrganizationID;
                  //  LoadStaffInfo(mProductionID, mWorkingSectionID);
                  //  LoadAssessmentVersion(mProductionID, mWorkingSectionID);
                }
            });
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });
}
function LoadMainDataGrid(type, myData) {
    if (type == "first") {
        $('#grid_Main').datagrid({
            fit: true,
            toolbar: "#toorBar",
            rownumbers: true,
            singleSelect: true,
            striped: true,
            data: []
        });
    }
    else {
        $('#grid_Main').datagrid('loadData', myData);
    }
}
//function LoadStaffInfo(productionId, workingSectionId) {
//    $.ajax({
//        type: "POST",
//        url: "StaffAssessment.aspx/GetStaffInfo",
//        data: " {mOrganizationID:'" + productionId + "',mWorkingSectionID:'" + workingSectionId + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (msg) {
//            var myData = jQuery.parseJSON(msg.d);
//            $('#Staff').combobox({
//                data: myData.rows,
//                valueField: 'id',
//                textField: 'text',
//                panelHeight: 'auto',
//                onSelect: function (record) {
//                    mStaffId = record.id;
//                }
//            });
//            $('#Staff').combobox('select', 0);
//        },
//        error: function () {
//            // $("#grid_Main").datagrid('loadData', []);
//            $.messager.alert('失败', '加载失败！');
//        }
//    });
//}
//function LoadAssessmentVersion(productionId, workingSectionId) {
//    $.ajax({
//        type: "POST",
//        url: "StaffAssessmentRanking.aspx/GetAssessmentVersion",
//        data: " {mOrganizationID:'" + productionId + "',mWorkingSectionID:'" + workingSectionId + "'}",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (msg) {
//            var myData = jQuery.parseJSON(msg.d);
//            $('#AssessmentVersion').combobox({
//                data: myData.rows,
//                valueField: 'KeyId',
//                textField: 'Name',
//                panelHeight: 'auto',
//                onSelect: function (record) {
//                    mVersionId = record.KeyId;
//                }
//            });
//            $('#Staff').combobox('select', 0);
//        },
//        error: function () {
//            // $("#grid_Main").datagrid('loadData', []);
//            $.messager.alert('失败', '加载失败！');
//        }
//    });
//}
function Query() {
    //var mOrganizationId = "";
    //var mWorkingSectionID = "";  岗位ID
    //var mProductionName = "";   
    //var mProductionID = "";  产线ID
    //var mStaffId = "";   员工ID
    //mGroupId 考核组 
    //var mStartTime = "";   开始时间
    //var mEndTime = "";     结束时间
    //mVersionId         版本   
    //mStatisticalCycle  统计周期
    if (mProductionID == "" && mWorkingSectionID == "" && mGroupId == "" && mStatisticalCycle == "") {
        $.messager.alert('提示', '请选择未选项！');
    } else {
        //加载表头 
        var mUrl = "";
        var mData = "";
        if (mStatisticalCycle != "year") {
            if (mStatisticalCycle == "day") {
                mStartTime = $('#date_sday').datebox('getValue');
                mEndTime = $('#date_eday').datebox('getValue');                
            } else if (mStatisticalCycle == "month") {
                mStartTime = $('#date_smonth').combobox('getValue');
                mEndTime = $('#date_emonth').combobox('getValue');
                mStartTime = mStartTime + "-01";
                mEndTime = mEndTime + "-01";
            }
            if (mStartTime > mEndTime) {
                $.messager.alert('错误', '开始日期不能大于结束日期！');
            }
            LoadColumns();
            mUrl = "StaffAssessmentRanking.aspx/GetAssessmentResult";
            mData = " {mProductionID:'" + mProductionID + "',mWorkingSectionID:'" + mWorkingSectionID + "',mGroupId:'" + mGroupId + "',mStartTime:'" + mStartTime + "',mEndTime:'" + mEndTime + "',mStatisticalCycle:'" + mStatisticalCycle + "'}";
        }
        //else {

        //}
        $.ajax({
            type: "POST",
            url: mUrl,
            data: mData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var myData = jQuery.parseJSON(msg.d);
                if (myData.total == 0) {
                    $('#grid_Main').datagrid({ columns: [] });
                    LoadMainDataGrid("last", []);
                    $.messager.alert('提示', '未查询到考核数据！');
                } else {
                    LoadMainDataGrid("last", myData);
                }
            },
            error: function () {
                $('#grid_Main').datagrid({ columns: [] });
                LoadMainDataGrid("last", []);
                $.messager.alert('提示', '未查询到考核数据！');
                //$("#grid_Main").datagrid('loadData', []);
                //$.messager.alert('失败', '加载失败！');
            }
        });
    }
}
function LoadColumns() {
    var mData = [];
    $.ajax({
        type: "POST",
        url: "StaffAssessmentRanking.aspx/GetAssessmentResultColumnsJson",
        data: "{mProductionID:'" + mProductionID + "',mWorkingSectionID:'" + mWorkingSectionID + "',mGroupId:'" + mGroupId + "',mStartTime:'" + mStartTime + "',mEndTime:'" + mEndTime + "',mStatisticalCycle:'" + mStatisticalCycle + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d).columns;
            $('#grid_Main').datagrid({
                columns: [myData]
            });
        },
        error: function () {          
            $.messager.alert('失败', '表结构加载失败！');
        }
    });
}
//初始化时间
function InitialDate(type) {
    var nowDate = new Date();
    var beforeDate = new Date();
    if ("year" == type) {
        $(".myear").show();
        $(".mmonth").hide();
        $(".mday").hide();
        var lastYear = nowDate.getFullYear() - 1;
        var mData = [];
        for (var i = 0; i < 3; i++) {
            lastYear = lastYear - i;
            mdata = {
                type: lastYear,
                value: lastYear
            };
            mData.push(mdata);
        }
        $("#date_year").combobox({
            valueField: 'value',
            textField: 'type',
            data: mData,
            panelHeight: 'auto'
            //,
            //onSelect: function (node) {
            //    mValue = node.value;
            //  //  InitialDate(mValue)
            //}
        });
        $('#date_year').combobox('setValue', nowDate.getFullYear() - 1);
    }
    else if ("month" == type) {
        $(".myear").hide();
        $(".mmonth").show();
        $(".mday").hide();
        var mData = [];
        for (var i = nowDate.getMonth() ; i >= 1 ; i--) {
            if (i < 10) {
                i = "0" + i;
            }
            var monthDate = nowDate.getFullYear() + '-' + i;
            mdata = {
                type: monthDate,
                value: monthDate
            };
            mData.push(mdata);
        }
        $("#date_smonth").combobox({
            valueField: 'value',
            textField: 'type',
            data: mData,
            panelHeight: 'auto'
            //,
            //onSelect: function (node) {
            //    mValue = node.value;
            //    //InitialDate(mValue)
            //}
        });
        var startDate = "";
        if (nowDate.getMonth() <= 10 && nowDate.getMonth()>1) {
            startDate = nowDate.getFullYear() + '-0' + (nowDate.getMonth()-1);
        } else if (nowDate.getMonth() - 1 == 0) {
            startDate = (nowDate.getFullYear() - 1) + '-12';
        } else {
            startDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() - 1);
        }
        $('#date_smonth').combobox('setValue', startDate);
        $("#date_emonth").combobox({
            valueField: 'value',
            textField: 'type',
            data: mData,
            panelHeight: 'auto'
            //,
            //onSelect: function (node) {
            //    mValue = node.value;
            //   // InitialDate(mValue);
            //}
        });
        var endDate = nowDate.getFullYear() + '-' + (nowDate.getMonth());
        if (nowDate.getMonth() < 10) {
            var endDate = nowDate.getFullYear() + '-0' + (nowDate.getMonth());
        }
        $('#date_emonth').combobox('setValue', endDate);
    }
    else if ("day" == type) {
        $(".myear").hide();
        $(".mmonth").hide();
        $(".mday").show();
        beforeDate.setDate(nowDate.getDate() - 10);
        var startDate = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + (beforeDate.getDate());
        var endDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
        sday = $('#date_sday').datebox('setValue', startDate);
        eday = $('#date_eday').datebox('setValue', endDate);
    } else {
        $(".myear").hide();
        $(".mmonth").hide();
        $(".mday").hide();
    }
}


