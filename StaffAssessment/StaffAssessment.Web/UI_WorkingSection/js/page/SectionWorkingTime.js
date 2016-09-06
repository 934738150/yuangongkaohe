
var mOrganizationId = "";
var mShiftDescriptionID = "";
var mWorkingSectionID = "";
var mProductionName = "";  //产线名称

var mWorkingSection = "";
var mShifts = "";
var mStartTime = "";
var mEndTime = "";
var mRemark = "";  //备注

$(document).ready(function () {
    LoadMainDataGrid("first");
    //LoadWorkingSection();
});

function onOrganisationTreeClick(node) {
    $('#organizationName').textbox('setText', node.text);
    mOrganizationId = node.OrganizationId;
    LoadWorkingSection(mOrganizationId);
    LoadWorkingSectionGrid(mOrganizationId);
}
var workingSectionName = "";
function LoadWorkingSection(mValue) {
    $.ajax({
        type: "POST",
        url: "SectionWorkingTime.aspx/GetWorkingSection",
        data: " {mOrganizationID:'" + mValue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#section').combobox({
                valueField: 'WorkingSectionName',
                textField: 'WorkingSectionName',
                panelHeight: 'auto',
                data: myData.rows
                //,
                //onSelect: function (record) {
                //    workingSectionName = record.WorkingSectionName;
                //}
            });         
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '加载失败！');
        }
    });
}
function LoadWorkingSectionGrid(mValue){
    $.ajax({
        type: "POST",
        url: "SectionWorkingTime.aspx/GetWorkingSectionGrid",
        data: " {mOrganizationId:'" + mValue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = jQuery.parseJSON(msg.d);
            $('#workingSection').combogrid({
                panelWidth: '182px',
                panelHeight: '160px',
                idField: 'WorkingSectionID',
                textField: 'WorkingSectionName',
                columns: [[
                    { field: 'WorkingSectionID', title: '', width: 60, hidden: true },
                    { field: 'WorkingSectionName', title: '岗位名称', width: 80 },
                    { field: 'OrganizationName', title: '产线', width: 100 }
                ]],
                data:myData,
                onSelect: function (index, row) {
                    mWorkingSectionID = row.WorkingSectionID;
                    mProductionName = row.OrganizationName;
                    $('#productionName').textbox('setText', mProductionName);
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
                    { field: 'WorkingSectionName', title: '岗位名称', width: 80 },
                    { field: 'OrganizationName', title: '所在产线', width: 100 },
                    { field: 'Shifts', title: '班次', width: 60 },
                    { field: 'StartTime', title: '开始时间', width: 80 },
                    { field: 'EndTime', title: '结束时间', width: 120 },
                    { field: 'Remark', title: '备注', width: 80 },
                    {
                        field: 'edit', title: '编辑', width: 150, formatter: function (value, row, index) {
                            var str = "";
                            str = '<a href="#" onclick="editFun(true,\'' + row.ShiftDescriptionID + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_edit.png" title="编辑页面" onclick="editFun(true,\'' + row.ShiftDescriptionID + '\')"/>编辑</a>';
                            str = str + '<a href="#" onclick="deleteFun(\'' + row.ShiftDescriptionID + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_deleteFun.png" title="删除页面"  onclick="deleteFun(\'' + row.ShiftDescriptionID + '\')"/>删除</a>';
                            //str = str + '<img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_deleteFun.png" title="删除页面" onclick="deleteFunPageFun(\'' + row.id + '\');"/>删除';
                            return str;
                        }
                    }
            ]],
            fit: true,
            toolbar: "#toorBar",
            idField: 'ShiftDescriptionID',
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

function Query() {
    if (mOrganizationId == "" || mOrganizationId == undefined) {
        $.messager.alert('提示', '请选择组织机构！');
    }
    workingSectionName=$('#section').combobox('getText');
    $.ajax({
        type: "POST",
        url: "SectionWorkingTime.aspx/GetQueryData",
        data: " {mOrganizationId:'" + mOrganizationId + "',mWorkingSectionName:'" + workingSectionName + "'}",
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
            mger = $.messager.alert('提示', "加载中...");
        },
        error: function () {
            $("#grid_Main").datagrid('loadData', []);
            $.messager.alert('失败', '获取数据失败');
        }
    });
}
function refresh() {
    Query();
}
function addFun() {
    editFun(false);
}

function save()
{
    mWorkingSection = $('#workingSection').combogrid('getText');
    mShifts = $('#shift').combobox('getText');
    mStartTime = $('#beginTime').timespinner('getValue');
    mEndTime = $('#endTime').timespinner('getValue');
    mRemark = $('#remark').textbox('getText');
    if (mWorkingSection == "" || mWorkingSection == undefined || mShifts == "" || mShifts == undefined || mStartTime == "" || mStartTime == undefined || mEndTime == "" || mEndTime == undefined)
    {
        $.messager.alert('提示', '请填写未填项!');
    } 
    else {
        var mUrl = "";
        var mdata = "";
        if (IsAdd) {
            mUrl = "SectionWorkingTime.aspx/AddSectionWorkingDefine";
            mdata = "{mWorkingSectionID:'" + mWorkingSectionID + "',mShifts:'" + mShifts + "',mStartTime:'" + mStartTime + "',mEndTime:'" + mEndTime + "',mRemark:'" + mRemark + "'}";
        } else if (IsAdd == false) {
            mUrl = "SectionWorkingTime.aspx/EditSectionWorkingDefine";
            mdata = "{mShiftDescriptionID:'" + mShiftDescriptionID + "',mWorkingSectionID:'" + mWorkingSectionID + "',mShifts:'" + mShifts + "',mStartTime:'" + mStartTime + "',mEndTime:'" + mEndTime + "',mRemark:'" + mRemark + "'}";
        }
        $.ajax({
            type: "POST",
            url: mUrl,
            data: mdata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var myData = msg.d;
                if (myData == 1) {
                    $.messager.alert('提示', '操作成功！');
                    $('#AddandEditor').window('close');
                    refresh();
                }
                else {
                    $.messager.alert('提示', '操作失败！');
                    refresh();
                }
            },
            error: function () {
                $.messager.alert('提示', '操作失败！');
                refresh();
            }
        });
    }
}
function editFun(IsEdit, editContrastId) {
    if (IsEdit) {
        IsAdd = false;
        $('#grid_Main').datagrid('selectRecord', editContrastId);
        var data = $('#grid_Main').datagrid('getSelected');

        $('#workingSection').combogrid('setText', data.WorkingSectionName);
        $('#productionName').textbox('setText', data.OrganizationName);
        
        $('#shift').combobox('setText', data.Shifts);
        $('#beginTime').timespinner('setValue', data.StartTime);
        $('#endTime').timespinner('setValue', data.EndTime);
        $('#remark').textbox('setText', data.Remark);
      
        mShiftDescriptionID = data.ShiftDescriptionID;
        mWorkingSectionID = data.WorkingSectionID;

    }
    else {
        IsAdd = true;

        $('#workingSection').combogrid('setText', '');
        $('#productionName').textbox('setText', '');

        $('#shift').combobox('setText', '');
        $('#beginTime').timespinner('setValue', '00:00');
        $('#endTime').timespinner('setValue','12:00');
        $('#remark').textbox('setText','');

        if (mOrganizationId == "" && mOrganizationId == undefined) {
            $.messager.alert('提示', '请选择组织机构！');
        }
    }
    $('#AddandEditor').window('open');
}

function deleteFun(deleteFunContrastId) {

    $('#grid_Main').datagrid('selectRecord', deleteFunContrastId);
    var data = $('#grid_Main').datagrid('getSelected');

    mShiftDescriptionID = data.ShiftDescriptionID;
    
    $.ajax({
        type: "POST",
        url: "SectionWorkingTime.aspx/deleteFunSectionWorkingDefine",
        data: "{mShiftDescriptionID:'" + mShiftDescriptionID + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = msg.d;
            if (myData == 1) {
                $.messager.alert('提示', '删除成功！');
                $('#AddandEditor').window('close');
                refresh();
            }
            else {
                $.messager.alert('提示', '操作失败！');
                refresh();
            }
        },
        error: function () {
            $.messager.alert('提示', '操作失败！');
            $('#AddandEditor').window('close');
            refresh();
        }
    });
}