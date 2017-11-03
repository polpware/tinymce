define(
  'ephox.snooker.model.RunOperation',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Options',
    'ephox.snooker.api.Structs',
    'ephox.snooker.api.TableLookup',
    'ephox.snooker.model.DetailsList',
    'ephox.snooker.model.Transitions',
    'ephox.snooker.model.Warehouse',
    'ephox.snooker.operate.Redraw',
    'ephox.snooker.resize.BarPositions',
    'ephox.snooker.resize.Bars',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Arr, Merger, Fun, Option, Options, Structs, TableLookup, DetailsList, Transitions, Warehouse, Redraw, BarPositions, Bars, Compare, Traverse) {
    var fromWarehouse = function (warehouse, generators) {
      return Transitions.toGrid(warehouse, generators, false);
    };

    var deriveRows = function (rendered, generators) {
      // The row is either going to be a new row, or the row of any of the cells.
      var findRow = function (details) {
        var rowOfCells = Options.findMap(details, function (detail) {
          return Traverse.parent(detail.element()).map(function (row) {
            // If the row has a parent, it's within the existing table, otherwise it's a copied row
            var isNew = Traverse.parent(row).isNone();
            return Structs.elementnew(row, isNew);
          });
        });
        return rowOfCells.getOrThunk(function () {
          return Structs.elementnew(generators.row(), true);
        });
      };

      return Arr.map(rendered, function (details) {
        var row = findRow(details.details());
        return Structs.rowdatanew(row.element(), details.details(), details.section(), row.isNew());
      });
    };

    var toDetailList = function (grid, generators) {
      var rendered = Transitions.toDetails(grid, Compare.eq);
      return deriveRows(rendered, generators);
    };

    var findInWarehouse = function (warehouse, element) {
      var all = Arr.flatten(Arr.map(warehouse.all(), function (r) { return r.cells(); }));
      return Arr.find(all, function (e) {
        return Compare.eq(element, e.element());
      });
    };

    var run = function (operation, extract, adjustment, postAction, genWrappers) {
      return function (wire, table, target, generators, direction) {
        var input = DetailsList.fromTable(table);
        var warehouse = Warehouse.generate(input);
        var output = extract(warehouse, target).map(function (info) {
          var model = fromWarehouse(warehouse, generators);
          var result = operation(model, info, Compare.eq, genWrappers(generators));
          var grid = toDetailList(result.grid(), generators);
          return {
            grid: Fun.constant(grid),
            cursor: result.cursor
          };
        });

        return output.fold(function () {
          return Option.none();
        }, function (out) {
          var newElements = Redraw.render(table, out.grid());
          adjustment(table, out.grid(), direction);
          postAction(table);
          Bars.refresh(wire, table, BarPositions.height, direction);
          return Option.some({
            cursor: out.cursor,
            newRows: newElements.newRows,
            newCells: newElements.newCells
          });
        });
      };
    };

    var onCell = function (warehouse, target) {
      return TableLookup.cell(target.element()).bind(function (cell) {
        return findInWarehouse(warehouse, cell);
      });
    };

    var onPaste = function (warehouse, target) {
      return TableLookup.cell(target.element()).bind(function (cell) {
        return findInWarehouse(warehouse, cell).map(function (details) {
          return Merger.merge(details, {
            generators: target.generators,
            clipboard: target.clipboard
          });
        });
      });
    };

    var onPasteRows = function (warehouse, target) {
      var details = Arr.map(target.selection(), function (cell) {
        return TableLookup.cell(cell).bind(function (lc) {
          return findInWarehouse(warehouse, lc);
        });
      });
      var cells = Options.cat(details);
      return cells.length > 0 ? Option.some(Merger.merge({cells: cells}, {
        generators: target.generators,
        clipboard: target.clipboard
      })) : Option.none();
    };

    var onMergable = function (warehouse, target) {
      return target.mergable();
    };

    var onUnmergable = function (warehouse, target) {
      return target.unmergable();
    };

    var onCells = function (warehouse, target) {
      var details = Arr.map(target.selection(), function (cell) {
        return TableLookup.cell(cell).bind(function (lc) {
          return findInWarehouse(warehouse, lc);
        });
      });
      var cells = Options.cat(details);
      return cells.length > 0 ? Option.some(cells) : Option.none();
    };

    return {
      run: run,
      toDetailList: toDetailList,
      onCell: onCell,
      onCells: onCells,
      onPaste: onPaste,
      onPasteRows: onPasteRows,
      onMergable: onMergable,
      onUnmergable: onUnmergable
    };
  }
);