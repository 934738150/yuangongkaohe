$(document).ready(function () {
    InitialDate();
    LoadMainDataGrid("first");
});
function InitialDate() {
    var nowDate = new Date();
    var beforeDate = new Date();
    beforeDate.setDate(nowDate.getDate() - 5);
    var nowString = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    var beforeString = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
    $('#startTime').datebox('setValue', beforeString);
    $('#endTime').datebox('setValue', nowString);
}
var mOrganizationId="";
function onOrganisationTreeClick(node) {
    $('#organizationName').textbox('setText', node.text);
    mOrganizationId=node.OrganizationId;
    LoadStaffInfo(mOrganizationId);
}
var mStaffId = "";
function LoadStaffInfo(mValue) {
    $.ajax({
        type: "POST",
        url: "StaffSignInModify.aspx/GetStaffInfo",
        data: " {mOrganizationID:'" + mValue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {     
            var myData = jQuery.parseJSON(msg.d);
            $('#Staff').combobox({
                data:myData.rows,
                valueField: 'id',
                textField: 'text',
                panelHeight: 'auto',
                onSelect: function (record) {
                    mStaffId= record.id;
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
            columns: [[
                    { field: 'vDate', title: '签到时间', width: 100 },
                    { field: 'StaffName', title: '签到员工', width: 80 },
                    { field: 'Shifts', title: '所在班次', width: 60, align: "center" },
                    { field: 'WorkingSectionName', title: '岗位', width: 80, align: "center" },
                    { field: 'Creator', title: '创建人', width: 80, align: "center" },
                    { field: 'CreateTime', title: '创建时间', width: 80, align: "center" },
                    { field: 'Remark', title: '备注', width: 80, align: "center" },
                    {
                        field: 'edit', title: '编辑', width: 150, formatter: function (value, row, index) {
                            var str = "";
                            str = '<a href="#" onclick="editStaffSignIn()"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_edit.png" title="编辑页面" onclick="editStaffSignIn()"/>编辑</a>';
                            str = str + '<a href="#" onclick="deleteStaffSignIn()"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面"  onclick="deleteStaffSignIn()"/>删除</a>';
                            //str = str + '<img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_delete.png" title="删除页面" onclick="DeletePageFun(\'' + row.id + '\');"/>删除';
                        return str;
                    }}
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
        $('#grid_Main').datagrid('loadData',myData);
    }
}
function historyQuery()
{
    //mOrganizationId
     //mStaffId 
    if (mOrganizationId == "" && mOrganizationId == undefined) {
        $.messager.alert('提示','请选择组织机构！');
    }
    var mStartTime = $('#startTime').datebox('getValue');
    var mEndTime = $('#endTime').datebox('getValue');
    $.ajax({
        type: "POST",
        url: "StaffSignInModify.aspx/GetHistoryStaffSignInData",
        data: " {mOrganizationId:'" + mOrganizationId + "',  mStaffId:'" + mStaffId + "', mStartTime:'" + mStartTime + "', mEndTime:'" + mEndTime + "'}",
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