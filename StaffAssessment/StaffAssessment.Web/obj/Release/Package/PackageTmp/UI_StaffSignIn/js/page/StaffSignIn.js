var mStaffID = '';
var editIndex = undefined;      //重置编辑索引行
$(function () {
    LoadThreeDays();
    InitialDate();
    loadDataGrid("first");
    LoadMainDataGrid("first");
});
//初始化日期框
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    if (m < 10) {
        var m = "0"+m;
    }
    if (d < 10) {
        var d = "0" + d;
    }
    return y + "-" + m + "-" + d;
}
var yesterday = GetDateStr(-1);
var today = GetDateStr(0);
var tomorrow = GetDateStr(+1);
var data1 = [{ "id": yesterday, "text": yesterday }, { "id": today, "text": today }, { "id": tomorrow, "text": tomorrow }];
function LoadThreeDays(){
    $('#mTime1').combobox({
        data: data1,
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        onSelect: function (record) {
        }
    });
    $("#mTime1").combobox('setValue', today);
}
function InitialDate() {
    var nowDate = new Date();
    var beforeDate = new Date();
    beforeDate.setDate(nowDate.getDate() - 5);
    var nowString = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    var beforeString = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
    $('#startTime').datebox('setValue', beforeString);
    $('#endTime').datebox('setValue', nowString);
}
function onOrganisationTreeClick(node) {
    $('#organizationId').val(node.OrganizationId);
    $('#productLineName').textbox('setText', node.text);
    mOrganizationID = node.OrganizationId;
    LoadStaffInfo(mOrganizationID);
}

function LoadStaffInfo(mValue) {
    $.ajax({
        type: "POST",
        url: "StaffSignIn.aspx/GetStaffInfo",
        data: " {mOrganizationID:'" + mValue + "'}",
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
                    mStaffID = record.id;
                }
            });
            $('#DownStaff').combobox({
                data: myData.rows,
                valueField: 'id',
                textField: 'text',
                panelHeight: 'auto',
                onSelect: function (record) {
                    mStaffId = record.id;
                }
            });
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });
}
function Query() {
    //$('#staffSignInEditor').window('open');
    //var organizationName = $('##organizationId').textbox('getText');
    var organizationId = $('#organizationId').val();
    if (organizationId == "") {
        $.messager.alert('警告', '请选择组织机构');
        return;
    }
    if ($('#Staff').combobox('getText') == "") {
        $.messager.alert('警告', '请选择签到员工！');
        return;
    } else {
        $.ajax({
            type: "POST",
            url: "StaffSignIn.aspx/GetStaffIn",
            data: '{mOrganizationID: "' + mOrganizationID + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                m_MsgData = jQuery.parseJSON(msg.d);
                if (m_MsgData.total == 0) {
                    $('#Windows_Report').datagrid('loadData', []);
                    $.messager.alert('提示', '没有相关数据！');
                }
                else {
                    loadDataGrid("last", m_MsgData);
                }
            },
            error: function handleError() {
                $('#Windows_Report').datagrid('loadData', []);
                $.messager.alert('失败', '获取数据失败');
            }
        });
    }
   
}
function loadDataGrid(type, myData) {
    if ("first" == type) {
        $("#Windows_Report").datagrid({
            striped: true,
            rownumbers: true,
            singleSelect: true,
            fit: true,
            //data: [],
            //pagination: true,
            toolbar: '#toolbar_ReportTemplate',
            columns: [[
                { field: 'Name', title: '产线', width: 120 },
                { field: 'WorkingSectionName', title: '岗位', width: 60 },
                {
                    field: 'Shift', title: '班组', width: 55,
                    editor: {
                        type: 'combobox', editable: false, options: {
                            data:[
                                {"id":"甲班","text":"甲班"},
                                {"id":'乙班',"text":"乙班"},
                                {"id":'丙班',"text":"丙班"}
                            ],
                            valueField: "id",
                            textField: "text",
                            panelHeight:'auto'
                        }
                    }
                },
                { field: 'Signin', title: '签到', width: 35, align: 'center', editor: { type: 'checkbox', options: { on: '✔', off: '' } } }
                //{
                //    field: 'ck', title: '签到', width: 35,
                //    formatter: function (value, rowData, rowIndex) {
                //    return value == 'YES' ? '<input name="ck" type="checkbox" checked="checked">' : '<input name="ck" type="checkbox">';
                //}}
            ]],
            onClickCell: onClickCell
        })
    }
    else {
        $("#Windows_Report").datagrid('loadData', myData);
    }
}
$().extend($.fn.datagrid.methods, {                     //扩展新的方法  editCell
    editCell: function (jq, param) {
        return jq.each(function () {
            var opts = $(this).datagrid('options');     //获取datagrid的属性
            var fields = $(this).datagrid('getColumnFields', true).concat($(this).datagrid('getColumnFields'));  //返回列字段，如果设置了frozen属性为true，将返回固定列的字段名
            for (var i = 0; i < fields.length; i++) {
                var col = $(this).datagrid('getColumnOption', fields[i]);  //返回特定列的属性
                col.editor1 = col.editor;     //获取列属性的编辑
                if (fields[i] != param.field) {
                    col.editor = null;
                }
            }
            $(this).datagrid('beginEdit', param.index);    // 获取行
            for (var i = 0; i < fields.length; i++) {
                var col = $(this).datagrid('getColumnOption', fields[i]);
                col.editor = col.editor1;
            }
        });
    }
});

function endEditing() {
    if (editIndex == undefined) { return 'true' }     //返回真允许编辑
    if ($("#Windows_Report").datagrid('validateRow', editIndex)) {
        $("#Windows_Report").datagrid('endEdit', editIndex);
        editIndex = undefined;
        return 'true';
    } else {
        return 'false';
    }
}
function onClickCell(index, field) {
    if (endEditing()) {
        $("#Windows_Report").datagrid('selectRow', index)
                .datagrid('editCell', { index: index, field: field });
        editIndex = index;
    }
}
function Save() {
    endEditing();
    var rows = $('#Windows_Report').datagrid('getChanges');
    var mvDate = $('#mTime1').datebox('getValue');
    var length=rows.length;
    for (var i = 0; i < length; i++) {
        var mworkingId = rows[i].WorkingSectionID;
        var organizationId = rows[i].OrganizationID1;
        var mShift = rows[i].Shift;
        $.ajax({
            type: "POST",
            url: "StaffSignIn.aspx/Save",
            data: "{mworkingId:'" + mworkingId + "',organizationId:'" + organizationId + "',mvDate:'" + mvDate + "',mShift:'" + mShift + "',mStaffID:'" + mStaffID + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var result = msg.d;
            }
        })
    }
}
//下方表格
function LoadMainDataGrid(type, myData) {
    if (type == "first") {
        $('#grid_Main').datagrid({
            columns: [[
                    { field: 'vDate', title: '签到时间', width: 100 },
                    { field: 'StaffName', title: '签到员工', width: 80 },
                    { field: 'Shifts', title: '所在班次', width: 60, align: "center" },
                    { field: 'WorkingSectionName', title: '岗位', width: 80, align: "center" },
                    { field: 'Remark', title: '备注', width: 80, align: "center" }
            ]],
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
function historyQuery() {
    //mOrganizationId
    //mStaffId 
    if (mOrganizationID == "" && mOrganizationID == undefined) {
        $.messager.alert('提示', '请选择组织机构！');
    }
    var mStartTime = $('#startTime').datebox('getValue');
    var mEndTime = $('#endTime').datebox('getValue');
    if (mStartTime > mEndTime) {
        $.messager.alert('提示', '开始时间大于结束时间！');
    }
    if (mStaffId == "") {
        $.messager.alert('提示', '请选择员工！');
    } else {
        $.ajax({
            type: "POST",
            url: "StaffSignIn.aspx/GetHistoryStaffSignInData",
            data: " {mOrganizationID:'" + mOrganizationID + "',  mStaffId:'" + mStaffId + "', mStartTime:'" + mStartTime + "', mEndTime:'" + mEndTime + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                mger.window('close');
                var myData = jQuery.parseJSON(msg.d);
                if (myData.total == 0) {
                    LoadMainDataGrid("last", []);
                    $.messager.alert('提示', "没有查询的数据");
                } else {
                    LoadMainDataGrid("last", myData);
                }
            },
            beforeSend: function (XMLHttpRequest) {
                //alert('远程调用开始...');
                mger = $.messager.alert('提示', "加载中...");
            },
            error: function () {
                $("#grid_Main").datagrid('loadData', []);
                $.messager.alert('失败', '获取数据失败');
            }
        });
    }
}
