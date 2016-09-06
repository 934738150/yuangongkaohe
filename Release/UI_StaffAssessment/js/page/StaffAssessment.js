
var mOrganizationId = "";
var mWorkingSectionID = "";
var mProductionName = "";
var mProductionID = "";
var mStaffId = "";
var mStaffName = "";
var mStartTime = "";
var mEndTime = "";
var mGroupId = "";
var mGroupName = "";
var mStatisticalCycle = "";
var mAssessmentCycle = "";
var mVersionId = "";
$(document).ready(function () {
    InitialDate("month");
    LoadAssessmentGroupGrid();
    LoadMainDataGrid("first");
    LoadresultDetailDataGrid("first");// grid_resultDetail
});
function onOrganisationTreeClick(node) {
    $('#organizationName').textbox('setText', node.text);
    mOrganizationId = node.OrganizationId;
    LoadWorkingSectionGrid(mOrganizationId);
}
//加载岗位列表
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
                    LoadStaffInfo(mProductionID, mWorkingSectionID);     //员工信息
                    LoadAssessmentVersion(mProductionID, mWorkingSectionID);
                }
            });
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });
}
//根据岗位加载员工列表
function LoadStaffInfo(productionId, workingSectionId) {
    $.ajax({
        type: "POST",
        url: "StaffAssessment.aspx/GetStaffInfo",
        data: " {mProductionId:'" + productionId + "',mWorkingSectionID:'" + workingSectionId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#Staff').combobox({
                data: myData.rows,
                valueField: 'id',
                textField: 'text',
                panelHeight: 'auto',
                onSelect: function (record) {
                    mStaffId = record.id;
                    mStaffName = record.Name;
                }
            });
            $('#Staff').combobox('select', 0);
        },
        error: function () {
            $.messager.alert('失败', '加载失败！');
        }
    });
}
//加载考核分组
function LoadAssessmentGroupGrid() {
    $.ajax({
        type: "POST",
        url: "StaffAssessment.aspx/GetAssessmentGroupGrid",
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
                    mGroupName = row.Name;
                    mStatisticalCycle = row.StatisticalCycle;
                    InitialDate(mStatisticalCycle);
                    if (mStatisticalCycle == "day") {
                        mAssessmentCycle = "日";
                    } else if (mStatisticalCycle == "month") {
                        mAssessmentCycle = "月";
                    } else if (mStatisticalCycle == "year") {
                        mAssessmentCycle = "年";
                    }
                    $('#AssessmentCycle').textbox('setText', mAssessmentCycle);
                }
            });
        },
        error: function () {
            // $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });

}
//加载版本
function LoadAssessmentVersion(productionId, workingSectionId){
    $.ajax({
        type: "POST",
        url: "StaffAssessment.aspx/GetAssessmentVersion",
        data: " {mOrganizationID:'" + productionId + "',mWorkingSectionID:'" + workingSectionId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#AssessmentVersion').combobox({
                data: myData.rows,
                valueField: 'KeyId',
                textField: 'Name',
                panelHeight: 'auto',
                onSelect: function (record) {
                     mVersionId = record.KeyId;
                }
            });
            $('#Staff').combobox('select', 0);
        },
        error: function () {
           // $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });

}
var resultData;
function Calculate() {
    if (mStatisticalCycle=='month') {
        mStartTime = $('#date_smonth').combobox('getValue');
    
    }

    if (mStatisticalCycle != "day") {
        $.ajax({
            type: "POST",
            url: "StaffAssessment.aspx/CalculateStaffAssessment",  //(mProductionID, mWorkingSectionID, mStaffId,mStaffName, mGroupId,mGroupName, mStartTime, mVersionId, mStatisticalCycle)
            data: " {mProductionID:'" + mProductionID + "',mWorkingSectionID:'" + mWorkingSectionID + "',mStaffId:'" + mStaffId + "',mStaffName:'" + mStaffName + "',mGroupId:'" + mGroupId + "',mGroupName:'" + mGroupName + "',mStartTime:'" + mStartTime + "',mVersionId:'" + mVersionId + "',mStatisticalCycle:'" + mStatisticalCycle + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var myData = msg.d;
                var mData = myData.split("&");
                var tzData=jQuery.parseJSON(mData[0]);
                resultData = jQuery.parseJSON(mData[1]);
               
                if (myData.total == 0) {
                    $('#grid_Main').datagrid({ columns: [] });
                    LoadMainDataGrid("last", []);
                    $.messager.alert('提示', '0条考核数据！');
                } else {
                    LoadMainDataGrid("last", tzData);
                }
            },
            error: function () {
                $("#grid_Main").datagrid('loadData', []);
                $.messager.alert('失败', '加载失败！');
            }
        });

    } else {


    }
}
function Query() {
    //var mOrganizationId = "";
    //var mWorkingSectionID = "";  岗位ID
    //var mProductionName = "";   
    //var mProductionID = "";  产线ID
    //var mStaffId = "";   员工ID
    //mGroupId 考核组 
    //mGroupName
    //var mStartTime = "";   开始时间
    //var mEndTime = "";     结束时间
    //mVersionId         版本   
    //mStatisticalCycle  统计周期

    //var mStatisticalCycle = "";
    //var mAssessmentCycle = "";
    //var mVersionId = "";
    var mUrl = "";
    var mData = "";
    if (mStatisticalCycle == "day") {       
        mUrl = "StaffAssessment.aspx/GetAssessmentResultByDay";
        mData = " {mProductionID:'" + mProductionID + "',mWorkingSectionID:'" + mWorkingSectionID + "',mStaffId:'" + mStaffId + "',mGroupId:'" + mGroupId + "',mGroupName:'" + mGroupName + "',mStartTime:'" + mStartTime + "',mEndTime:'" + mEndTime + "',mVersionId:'" + mVersionId + "',mStatisticalCycle:'" + mStatisticalCycle + "'}";
        $.ajax({
            type: "POST",
            url: mUrl,
            data: mData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var myData = jQuery.parseJSON(msg.d);
                LoadMainDataGrid("last",myData);
            },
            error: function () {
                $("#grid_Main").datagrid('loadData', []);
                $.messager.alert('失败', '加载失败！');
            }
        });
    }
}
function AssessmentResultdetail(myKeyId,myStaffName) {
    var mStaffName = myStaffName;
    var m_Id = "";
    var m_AssessmentId = "";
    var m_ObjectId = "";
    var m_OrganizaitonID = "";
    var m_KeyId = "";
    var m_WeightedValue = "";
    var m_BestValue = "";
    var m_WorstValue = "";
    var m_AssessmenScore = "";
    var m_WeightedAverageCredit = "";
    var m_AssessmentName = "";
    var myDetail=[];
    for (var i = 0; i < resultData.rows.length; i++) {
        var test = resultData.rows[i]["KeyId"].toLowerCase();
        if(resultData.rows[i]["KeyId"].toLowerCase()==myKeyId){
            m_Id = resultData.rows[i]["Id"];
            m_AssessmentId = resultData.rows[i]["AssessmentId"];
            m_ObjectId = resultData.rows[i]["ObjectId"];
            m_OrganizaitonID = resultData.rows[i]["OrganizaitonID"];
            m_KeyId = resultData.rows[i]["KeyId"];
            m_WeightedValue = resultData.rows[i]["WeightedValue"];
            m_BestValue = resultData.rows[i]["BestValue"];
            m_WorstValue = resultData.rows[i]["WorstValue"];
            m_AssessmenScore = resultData.rows[i]["AssessmenScore"];
            m_WeightedAverageCredit = resultData.rows[i]["WeightedAverageCredit"];
            m_AssessmentName = resultData.rows[i]["AssessmentName"];
            var myRow = {"mStaffName":mStaffName, "Id": m_Id, "AssessmentId": m_AssessmentId, "ObjectId": m_ObjectId, "OrganizaitonID": m_OrganizaitonID, "KeyId": m_KeyId, "WeightedValue": m_WeightedValue, "BestValue": m_BestValue, "WorstValue": m_WorstValue, "AssessmenScore": m_AssessmenScore, "WeightedAverageCredit": m_WeightedAverageCredit, "AssessmentName": m_AssessmentName };
            myDetail.push(myRow);
        }
    }
    myDetail
    LoadresultDetailDataGrid('last', myDetail);
}


function LoadMainDataGrid(type, myData) {
    if (type == "first") {
        $('#grid_Main').datagrid({
            columns: [[
                    { field: 'mStaffName', title: '员工', width: 60 },
                    { field: 'StartTime', title: '考核开始时间', width: 120 },
                    { field: 'EndTime', title: '考核结束时间', width: 120 },
                    {
                        field: 'edit', title: '查看', width: 60, formatter: function (value, row, index) {
                            return  '<a href="#" onclick="AssessmentResultdetail(\'' + row.KeyId + '\',\''+row.mStaffName+'\')"><img class="iconImg" src = "/lib/ealib/themes/icons/search.png" title="查看" onclick="AssessmentResultdetail(\'' + row.KeyId + '\',\''+row.mStaffName+ '\')"/>查看</a>';                           
                        }
                    }
            ]],
            fit: true,
           // toolbar: "#toorBar",
            idField: 'KeyId',
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
function LoadresultDetailDataGrid(type, myData) {
    if (type == "first") {
        $('#grid_resultDetail').datagrid({
            columns: [[
                    { field: 'mStaffName', title: '员工', width: 60 },
                    { field: 'AssessmentName', title: '考核项', width: 120 },
                    { field: 'WeightedValue', title: '权重', width: 120 },
                    { field: 'BestValue', title: '最好值', width: 120 },
                    { field: 'WorstValue', title: '最差值', width: 120 },
                    { field: 'AssessmenScore', title: '考核分', width: 120 },
                    { field: 'WeightedAverageCredit', title: '加权分', width: 120 }
            ]],
            fit: true,
            rownumbers: true,
            singleSelect: true,
            striped: true,
            data: []
        });
    }
    else {
        $('#grid_resultDetail').datagrid('loadData', myData);
    }
}
///初始化时间
function InitialDate(type) {
    var nowDate = new Date();
    var beforeDate = new Date();
    if ("year" == type) {
        $(".myear").show();
        $(".mmonth").hide();
        $(".mday").hide();
        var lastYear = nowDate.getFullYear() - 1;
        //myear = $("#date_year").val(lastYear);
        var mData = [];
        for (var i = 0; i < 3;i++){
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
            panelHeight: 'auto',
            onSelect: function (node) {
                mValue = node.value;
                InitialDate(mValue)
            }
        });
        $('#date_year').combobox('setValue', nowDate.getFullYear() - 1);
    }
    else if ("month" == type) {
        $(".myear").hide();
        $(".mmonth").show();
        $(".mday").hide();
        //emonth = $("#date_emonth").val(endDate);
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
            data:mData,
            panelHeight: 'auto',
            onSelect: function (node) {
                mValue = node.value;
                InitialDate(mValue)
            }
        });
        var endDate = nowDate.getFullYear() + '-' + (nowDate.getMonth());
        if (nowDate.getMonth() < 10) {
            var endDate = nowDate.getFullYear() + '-0' + (nowDate.getMonth());
        }
        $('#date_smonth').combobox('setValue', endDate);
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
    }
}
